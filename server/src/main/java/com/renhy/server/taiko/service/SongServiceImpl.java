package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.common.UUIDUtils;
import com.renhy.server.taiko.mapper.SongMapper;
import com.renhy.server.taiko.entity.Song;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class SongServiceImpl extends ServiceImpl<SongMapper, Song> implements SongService {



    @Override
    public List<Song> list() {
        return selectList(
                new EntityWrapper<>());
    }

    @Override
    public Song getById(String id) {
        return getById(id, false);
    }

    @Override
    public Song getById(String id, boolean validateNotNull) {
        Song song = selectById(id);

        if (validateNotNull && song == null) {
            throw new BusException("曲目未找到");

        }

        return song;
    }

    @Override
    public Song load(MultipartFile file) {
        return null;
    }

    @Override
    public Song updateWave(String id, MultipartFile file) {
        return null;
    }
}
