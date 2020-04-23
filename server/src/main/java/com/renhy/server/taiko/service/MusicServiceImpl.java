package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.common.UUIDUtils;
import com.renhy.server.taiko.entity.Diffculty;
import com.renhy.server.taiko.entity.MusicEntity;
import com.renhy.server.taiko.mapper.MusicMapper;
import com.renhy.server.taiko.song.Music;
import com.renhy.server.taiko.song.Song;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MusicServiceImpl extends ServiceImpl<MusicMapper, MusicEntity> implements MusicService {


    @Autowired
    private SongService songService;


    @Override
    public Music getBySongTagAndDiffculty(String tag, Diffculty diffculty) {
        Song song = songService.getByTag(tag, true);

        MusicEntity entity = selectOne(
                new EntityWrapper<MusicEntity>()
                        .eq("song_id", song.getId())
                        .eq("diffculty", diffculty));

        if (entity == null) {
            throw new BusException("曲谱未找到");
        }

        return Music.fromEntity(entity);
    }

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
