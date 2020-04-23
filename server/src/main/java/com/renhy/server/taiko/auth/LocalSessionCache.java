package com.renhy.server.taiko.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
public class LocalSessionCache implements SessionCache {

    private Map<String, Session> cache = new HashMap<>();


    @Scheduled(cron = "0 0 3 * * ? ")
    public void scanInterval() {
        log.info("Begin scan for expired session...");

        long now = System.currentTimeMillis();
        List<String> toRemove = new ArrayList<>();
        for (Map.Entry<String, Session> entry : cache.entrySet()) {
            if (entry.getValue().getExpiredAt() < now) {
                toRemove.add(entry.getKey());
            }
        }
        log.info("Scan over.");
        log.info(toRemove.size() + " expired key found.");

        for (String key : toRemove) {
            cache.remove(key);
        }
        log.info("Removed.");
    }


    @Override
    public Session get(String token) {
        Session session = cache.get(token);

        if (session == null) {
            return null;
        }

        if (session.getExpiredAt() < System.currentTimeMillis()) {
            cache.remove(token);
            return null;
        }

        return session;
    }

    @Override
    public void put(String token, Session session) {
        if (session.getExpiredAt() < System.currentTimeMillis()) {
            return;
        }
        cache.put(token, session);
    }

    @Override
    public void remove(String token) {
        cache.remove(token);
    }


}
