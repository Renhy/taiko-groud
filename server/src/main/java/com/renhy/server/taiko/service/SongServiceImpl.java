package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.mapper.SongMapper;
import com.renhy.server.taiko.entity.SongEntity;
import com.renhy.server.taiko.song.Parser;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class SongServiceImpl extends ServiceImpl<SongMapper, SongEntity> implements SongService {



    @Override
    public List<SongEntity> list() {
        return selectList(
                new EntityWrapper<SongEntity>()
                        .eq("deleted", false)
                        .orderBy("category, created_at"));
    }

    @Override
    public SongEntity getById(String id) {
        return getById(id, false);
    }

    @Override
    public SongEntity getById(String id, boolean validateNotNull) {
        SongEntity song = selectById(id);

        if (validateNotNull) {
            if (song == null || song.isDeleted()) {
                throw new BusException("曲目未找到");
            }
        }

        return song;
    }

    @Override
    public SongEntity load(MultipartFile song, MultipartFile wave) {
        try {
            Parser.Result result = Parser.parse(song);

        } catch (BusException e) {
            throw e;
        } catch (Exception e) {
            throw new BusException("曲目解析出错，请重试");
        }
        return null;
    }

    @Override
    public SongEntity updateWave(String id, MultipartFile file) {
        return null;
    }

    @Override
    public boolean delete(String id) {
        SongEntity song = getById(id, true);
        song.setDeleted(true);
        return updateById(song);
    }
}
