package com.renhy.server.taiko.auth;

public class ThreadUtils {

    private final static ThreadLocal<Session> sessionThreadLocal = new ThreadLocal<>();

    public static Session getLocalSession() {
        return sessionThreadLocal.get();
    }

    public static void setLocalSession(Session session) {
        sessionThreadLocal.set(session);
    }

    public static void removeLocalUser() {
        sessionThreadLocal.remove();
    }

}
