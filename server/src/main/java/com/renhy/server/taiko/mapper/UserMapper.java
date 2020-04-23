package com.renhy.server.taiko.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.renhy.server.taiko.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {
}
