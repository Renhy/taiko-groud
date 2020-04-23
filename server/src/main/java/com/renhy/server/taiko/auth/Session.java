package com.renhy.server.taiko.auth;

import com.renhy.server.taiko.entity.UserEntity;
import lombok.Data;

@Data
public class Session {


    private String userId;

    private String name;

    private boolean admin;

    private long expiredAt;


    public Session() {

    }

    public Session(UserEntity user) {
        this.userId = user.getId();
        this.name = user.getName();
        this.admin = user.isAdmin();
    }

}
