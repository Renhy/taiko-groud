package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.common.UUIDUtils;
import com.renhy.server.taiko.entity.MusicEntity;
import com.renhy.server.taiko.mapper.MusicMapper;
import com.renhy.server.taiko.song.Music;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MusicServiceImpl extends ServiceImpl<MusicMapper, MusicEntity> implements MusicService {


    @Autowired
    private SongService songService;



    @Override
    public boolean save(String songId, List<Music> musicList) {
        List<MusicEntity> entities = new ArrayList<>();
        for (Music music : musicList) {
            MusicEntity entity = new MusicEntity();
            entity.setId(UUIDUtils.timeBasedStr());
            entity.setSongId(songId);

            music.importInfo(entity);
            entities.add(entity);
        }

        return insertBatch(entities);
    }




}
