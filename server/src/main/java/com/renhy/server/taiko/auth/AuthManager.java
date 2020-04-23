package com.renhy.server.taiko.auth;

import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.entity.UserEntity;
import com.renhy.server.taiko.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.Base64Utils;

import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
public class AuthManager {

    private static final long EXPIRE_UNIT = 24 * 3600 * 1000;

    @Value("${auth.token-expire}")
    private long tokenExpire;

    @Value("${auth.secret}")
    private String secret;



    @Autowired
    private UserService userService;

    @Autowired
    private SessionCache cache;



    public String login(String loginName, String password) {
        UserEntity user = userService.getByLoginName(loginName);
        if (user == null) {
            throw new BusException("用户名或密码错误,请重试");
        }
        if (!user.getPassword().equals(hashPassword(password))) {
            throw new BusException("用户名或密码错误,请重试");
        }

        Session session = new Session(user);
        String token = UUID.randomUUID().toString();

        cache.put(token, session);
        return token;
    }

    public Session getSession(String token) {
        return cache.get(token);
    }



    public String hashPassword(String password) {
        return hashPassword(password, this.secret, "SHA-256", 2);
    }

    private String hashPassword(String password, String secret, String algorithm, int hashIterations) {
        try {
            MessageDigest digest = MessageDigest.getInstance(algorithm);

            digest.reset();
            digest.update(secret.getBytes("UTF-8"));

            byte[] hashed = password.getBytes("UTF-8");
            for (int i = 0; i < hashIterations; i++) {
                hashed = digest.digest(hashed);
            }

            return HexUtils.toHexString(hashed);
        } catch (Exception e) {
            log.error("Error in hash password", e);
            return password;
        }
    }


}
