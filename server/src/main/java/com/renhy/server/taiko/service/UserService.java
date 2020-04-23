package com.renhy.server.taiko.service;

import com.renhy.server.taiko.entity.UserEntity;

public interface UserService {


    UserEntity register(String loginName, String password, String name);

    UserEntity getByLoginName(String loginName);



}
