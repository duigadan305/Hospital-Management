package com.medicate.HospitalManagement.ws.configuration;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class CustomNotificationHandler extends TextWebSocketHandler {

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages if needed
    }

    public void sendNotification(WebSocketSession session, String message) throws Exception {
        session.sendMessage(new TextMessage(message));
    }
}
