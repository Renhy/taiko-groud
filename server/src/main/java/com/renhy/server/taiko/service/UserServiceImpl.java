package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.entity.UserEntity;
import com.renhy.server.taiko.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, UserEntity> implements UserService {


    @Override
    public UserEntity register(String loginName, String password, String name) {
        return null;
    }

    @Override
    public UserEntity getByLoginName(String loginName) {
        return null;
    }

}
