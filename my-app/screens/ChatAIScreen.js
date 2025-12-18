import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function ChatAIScreen() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.chatBox}>
        <ScrollView contentContainerStyle={styles.messages}>
          {/* MENSAGEM IA */}
          <View style={styles.aiRow}>
            {/* IMAGEM PERFIL DA IA */}
            <Image
              source={{ uri: "https://i.imgur.com/1X4E5Yp.png" }}
              style={styles.avatar}
            />
            <View style={styles.aiBubble}>
              <Text style={styles.aiText}>
                Oi, tudo bem? 😊
              </Text>
            </View>
          </View>

          <View style={styles.aiRow}>
            <Image
              source={{ uri: "https://i.imgur.com/1X4E5Yp.png" }}
              style={styles.avatar}
            />
            <View style={styles.aiBubble}>
              <Text style={styles.aiText}>
                Me diga o nome do aluno e eu ajudarei com as informações necessárias.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Insira aqui..."
            value={text}
            onChangeText={setText}
            style={styles.input}
          />

          <TouchableOpacity style={styles.sendBtn}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 12
  },

  chatBox: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#7C4DFF",
    borderRadius: 20,
    backgroundColor: "#FFF",
    padding: 10
  },

  messages: {
    paddingBottom: 10
  },

  /* IA */
  aiRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 8
  },

  aiBubble: {
    backgroundColor: "#0D47A1",
    padding: 12,
    borderRadius: 18,
    maxWidth: "75"
  },

  aiText: {
    color: "#FFF",
    fontSize: 14
  },

  /* USUÁRIO */
  userRow: {
    alignItems: "flex-end",
    marginBottom: 15
  },

  userBubble: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    borderRadius: 18,
    maxWidth: "75%"
  },

  userText: {
    color: "#000",
    fontSize: 14
  },

  /* INPUT */
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#DDD",
    paddingTop: 8
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8
  },

  sendBtn: {
    backgroundColor: "#512DA8",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },

  sendText: {
    color: "#FFF",
    fontSize: 18
  }
});
