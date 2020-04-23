package com.renhy.server.taiko.auth;

public interface SessionCache {


    Session get(String token);

    void put(String token, Session session);

    void remove(String token);

}
