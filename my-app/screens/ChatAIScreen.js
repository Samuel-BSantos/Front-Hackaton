import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import api from './api';

export default function ChatAIScreen() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou sua assistente virtual para gestão escolar. 😊"
    },
    {
      role: "assistant",
      content: "Posso ajudá-lo com informações sobre alunos, faltas, turmas e muito mais. Como posso ajudá-lo hoje?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  // Rola para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  function sendMessage() {
    if (!text.trim()) {
      Alert.alert("Atenção", "Por favor, digite uma mensagem.");
      return;
    }

    const userMessage = {
      role: "user",
      content: text.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setText("");

    sendToAI(userMessage.content);
  }

  async function sendToAI(prompt) {
    setLoading(true);

    try {

      console.log(`Enviando para LLM: ${prompt}`);


      const response = await api.post('/llmResponse', {
        prompt: prompt
      });

      console.log('Resposta da LLM:', response.data);

      const aiReply = {
        role: "assistant",
        content: response.data.response || "Desculpe, não consegui processar sua solicitação."
      };

      setMessages(prev => [...prev, aiReply]);

    } catch (error) {
      console.error('Erro ao conectar com a IA:', error);

      let errorMessage = "Erro ao conectar com o servidor. Verifique sua conexão.";

      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Erro interno no servidor. Tente novamente mais tarde.";
        } else if (error.response.data && error.response.data.detail) {
          errorMessage = `Erro: ${error.response.data.detail}`;
        }
      }

      // Adiciona mensagem de erro como resposta da IA
      const errorReply = {
        role: "assistant",
        content: `⚠️ ${errorMessage}`
      };

      setMessages(prev => [...prev, errorReply]);

      Alert.alert(
        "Erro de Conexão",
        "Não foi possível conectar com a assistente virtual. Verifique se o servidor LLM está rodando (localhost:3001) e tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (Platform.OS === 'web' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assistente Virtual</Text>
        <Text style={styles.headerSubtitle}>Ajuda com gestão escolar</Text>
      </View>

      <View style={styles.chatBox}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messages}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map((msg, index) => (
            msg.role === "assistant" ? (
              <View key={index} style={styles.aiRow}>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png" }}
                  style={styles.avatar}
                />
                <View style={styles.aiBubble}>
                  <Text style={styles.aiText}>{msg.content}</Text>
                  <Text style={styles.aiTime}>IA</Text>
                </View>
              </View>
            ) : (
              <View key={index} style={styles.userRow}>
                <View style={styles.userBubble}>
                  <Text style={styles.userText}>{msg.content}</Text>
                  <Text style={styles.userTime}>Você</Text>
                </View>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png" }}
                  style={styles.userAvatar}
                />
              </View>
            )
          ))}

          {loading && (
            <View style={styles.aiRow}>
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/4712/4712035.png" }}
                style={styles.avatar}
              />
              <View style={styles.aiBubble}>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color="#FFF" />
                  <Text style={styles.typingText}>Digitando...</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Digite sua pergunta sobre alunos, faltas, turmas..."
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
            maxLength={500}
            onKeyPress={handleKeyPress}
            editable={!loading}
          />

          <View style={styles.inputActions}>
            <Text style={styles.charCount}>{text.length}/500</Text>

            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!text.trim() || loading) && styles.sendBtnDisabled
              ]}
              onPress={sendMessage}
              disabled={!text.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.sendText}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.helpText}>
          Exemplos: "Quantas faltas tem o aluno João?", "Liste os alunos da turma A",
          "Quais alunos têm mais de 5 faltas?"
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#512DA8",
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    color: "#D1C4E9",
    fontSize: 14,
  },
  chatBox: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  messages: {
    paddingVertical: 20,
    paddingHorizontal: 5,
    paddingBottom: 30,
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#E3F2FD",
  },
  aiBubble: {
    backgroundColor: "#0D47A1",
    padding: 15,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    maxWidth: "80%",
  },
  aiText: {
    color: "#FFF",
    fontSize: 15,
    lineHeight: 20,
  },
  aiTime: {
    color: "#BBDEFB",
    fontSize: 11,
    marginTop: 5,
    textAlign: 'right',
  },
  userRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  userBubble: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 20,
    borderTopRightRadius: 5,
    maxWidth: "80%",
    marginRight: 10,
  },
  userText: {
    color: "#1B5E20",
    fontSize: 15,
    lineHeight: 20,
  },
  userTime: {
    color: "#81C784",
    fontSize: 11,
    marginTop: 5,
    textAlign: 'right',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C8E6C9",
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: "#FFF",
    fontSize: 14,
    marginLeft: 10,
    fontStyle: 'italic',
  },
  inputBox: {
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#FFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    minHeight: 50,
    maxHeight: 150,
    textAlignVertical: 'center',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  charCount: {
    color: "#999",
    fontSize: 12,
  },
  sendBtn: {
    backgroundColor: "#512DA8",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sendBtnDisabled: {
    backgroundColor: "#B39DDB",
    opacity: 0.7,
  },
  sendText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: 'bold',
  },
  helpText: {
    color: "#757575",
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderColor: "#EEE",
    marginTop: 10,
  },
});