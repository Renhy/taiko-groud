package com.renhy.server.taiko.service;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.renhy.server.taiko.common.BusException;
import com.renhy.server.taiko.common.UUIDUtils;
import com.renhy.server.taiko.entity.Category;
import com.renhy.server.taiko.mapper.SongMapper;
import com.renhy.server.taiko.entity.SongEntity;
import com.renhy.server.taiko.song.Parser;
import com.renhy.server.taiko.song.Song;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static com.renhy.server.taiko.common.StringUtils.clipSuffix;

@Slf4j
@Service
public class SongServiceImpl extends ServiceImpl<SongMapper, SongEntity> implements SongService {


    @Autowired
    private MusicService musicService;



    @Override
    public List<SongEntity> list() {
        return selectList(
                new EntityWrapper<SongEntity>()
                        .eq("deleted", false)
                        .orderBy("category, created_at"));
    }

    @Override
    public Song getById(String id) {
        return getById(id, false);
    }

    @Override
    public Song getById(String id, boolean validateNotNull) {
        SongEntity entity = selectOne(
                new EntityWrapper<SongEntity>()
                        .eq("id", id)
                        .eq("deleted", false));

        if (entity == null) {
            if (validateNotNull) {
                throw new BusException("曲目未找到");
            }
            return null;
        }

        return Song.fromEntity(entity);
    }

    @Override
    public Song getByTag(String tag) {
        return getByTag(tag, false);
    }

    @Override
    public Song getByTag(String tag, boolean validateNotNull) {
        SongEntity entity = selectOne(
                new EntityWrapper<SongEntity>()
                        .eq("tag", tag)
                        .eq("deleted", false));

        if (entity == null) {
            if (validateNotNull) {
                throw new BusException("曲目未找到");
            }
            return null;
        }

        return Song.fromEntity(entity);
    }

    @Override
    public boolean load(Category category, MultipartFile song, MultipartFile wave) {
        try {
            Parser.Result result = Parser.parse(song);

            SongEntity songEntity = new SongEntity();
            songEntity.setId(UUIDUtils.timeBasedStr());
            songEntity.setCategory(category);
            songEntity.setTag(
                    findTag(song.getOriginalFilename()));

            result.getSong().importInfo(songEntity);

            return
                    insert(songEntity) &&
                            musicService.save(songEntity.getId(), result.getMusics());
        } catch (BusException e) {
            throw e;
        } catch (Exception e) {
            log.error("parse song file error, ", e);
            throw new BusException("曲目解析出错，请重试");
        }
    }

    @Override
    public boolean updateWave(String id, MultipartFile file) {
        return false;
    }

    @Override
    public boolean delete(String id) {
        getById(id, true);
        SongEntity song = selectById(id);
        song.setDeleted(true);
        return updateById(song);
    }

    private String findTag(String fileName) {
        String tag = clipSuffix(fileName);
        if (getByTag(tag) == null) {
            return tag;
        }

        int index = 1;
        for(;;) {
            if (getByTag(tag + index) == null) {
                return tag + index;
            }

            index += 1;
        }
    }
}
