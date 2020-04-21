package com.renhy.server.taiko.mapper;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.renhy.server.taiko.entity.Music;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MusicMapper extends BaseMapper<Music> {
}
