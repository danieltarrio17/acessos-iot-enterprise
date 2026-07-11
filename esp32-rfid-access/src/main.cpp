#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>

// Definição de Pinos (Corrigidos para evitar conflitos)
#define SS_PIN 5
#define RST_PIN 25
#define RELAY_PIN 16 // Pino seguro para o Relé

MFRC522 rfid(SS_PIN, RST_PIN);
Adafruit_SSD1306 display(128, 64, &Wire, -1);

const char* ssid = "devolo-319";
const char* password = "DTHYQGNSRKXUTHKN";
const char* serverUrl = "http://192.168.1.70:3000/api/check-access";

bool relayActive = false;
unsigned long relayTimer = 0;

// Protótipos das funções
String getUID();
bool checkServer(String uid);
void saveToOfflineCache(String uid);
bool checkOfflineCache(String uid);
void showDisplay(String text);

void setup() {
    Serial.begin(115200);
    
    // Configuração do Relé com Lógica Invertida (Active-Low)
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, HIGH); // Começa desligado (HIGH desliga o relé)

    SPI.begin();
    rfid.PCD_Init();
    
    if(!SPIFFS.begin(true)){ 
        Serial.println("Erro ao inicializar o SPIFFS"); 
    }

    display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
    
    WiFi.begin(ssid, password);
    showDisplay("A LIGAR WIFI...");
    
    while (WiFi.status() != WL_CONNECTED) { 
        delay(500); 
    }
    showDisplay("SISTEMA ATIVO\nAguardando...");
}

void loop() {
    // 1. Temporizador do Relé (desliga a porta após 4 segundos)
    if (relayActive && (millis() - relayTimer >= 4000)) {
        digitalWrite(RELAY_PIN, HIGH); // Desliga o relé (Volta a HIGH)
        relayActive = false;
        showDisplay("SISTEMA ATIVO\nAguardando...");
    }

    // 2. Leitura RFID
    if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
        String uid = getUID();
        showDisplay("A VALIDAR...");
        
        bool authorized = false;

        if (WiFi.status() == WL_CONNECTED) {
            authorized = checkServer(uid);
            if (authorized) {
                saveToOfflineCache(uid); // Guarda em modo degradado caso a rede falhe
            }
        } else {
            showDisplay("MODO OFFLINE");
            authorized = checkOfflineCache(uid);
        }

        // 3. Atuação Física (Relé)
        if (authorized) {
            showDisplay("ACESSO CONCEDIDO");
            digitalWrite(RELAY_PIN, LOW); // Liga o relé (LOW dá o "Click!")
            relayActive = true;
            relayTimer = millis();
        } else {
            showDisplay("ACESSO NEGADO");
            delay(2000);
            showDisplay("SISTEMA ATIVO\nAguardando...");
        }
        
        // Pára a leitura deste cartão (evita ler o mesmo cartão em loop se mantido perto do sensor)
        rfid.PICC_HaltA(); 
    }
}

// Função para extrair o UID do cartão lido
String getUID() {
    String uid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
        uid += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
        uid += String(rfid.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();
    return uid;
}

// Função para validar o cartão no Backend Node.js
bool checkServer(String uid) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["uid"] = uid;
    doc["method"] = "RFID";
    
    String payload;
    serializeJson(doc, payload);

    int code = http.POST(payload);
    bool access = false;
    
    if (code == 200) {
        StaticJsonDocument<200> response;
        deserializeJson(response, http.getString());
        access = response["access"];
    }
    
    http.end();
    return access;
}

// Grava UID na memória não volátil do ESP32 (Modo Degradado)
void saveToOfflineCache(String uid) {
    if(checkOfflineCache(uid)) return; // Evita gravar duplicados
    
    File file = SPIFFS.open("/cache.txt", FILE_APPEND);
    if(file){
        file.println(uid);
        file.close();
    }
}

// Verifica se o UID está na memória local caso não haja rede
bool checkOfflineCache(String uid) {
    File file = SPIFFS.open("/cache.txt", FILE_READ);
    if(!file) return false;
    
    while(file.available()){
        String line = file.readStringUntil('\n');
        line.trim();
        if(line == uid) {
            file.close();
            return true;
        }
    }
    file.close();
    return false;
}

// Função para escrever texto no Ecrã OLED
void showDisplay(String text) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(WHITE);
    display.setCursor(0, 10);
    display.println(text);
    display.display();
}