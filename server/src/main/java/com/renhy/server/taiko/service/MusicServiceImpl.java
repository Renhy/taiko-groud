package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.entity.Music;
import com.renhy.server.taiko.mapper.MusicMapper;
import org.springframework.stereotype.Service;

@Service
public class MusicServiceImpl extends ServiceImpl<MusicMapper, Music> implements MusicService {
}
