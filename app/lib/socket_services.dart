//singleton pattern

// ignore_for_file: avoid_print

import 'dart:io';
import 'dart:io';

import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static final SocketService _instance = SocketService._internal();

  IO.Socket? socket;

  SocketService._internal();

  Function(dynamic data)? onLoginEvent;
  Function(dynamic data)? onLogoutEvent;

  factory SocketService() {
    return _instance;
  }

  void connectAndListen() {
    socket ??= IO.io('http://192.168.0.102:3000',
        IO.OptionBuilder().setTransports(['websocket']).build());

    socket!.onConnect((data) => {
          print('Connect to socket'),
        });

    socket!.on('session-expired', (data) {
      onLoginEvent?.call(data);
    });

    socket!.on('session-join', (data) => {onLoginEvent!.call(data)});
  }

  void joinSession(String userId) {
    socket!.emit('user-join', userId);
  }

  void dispose() {
    if (socket != null) {
      socket!.disconnect();
      socket = null;
    }
  }
}
