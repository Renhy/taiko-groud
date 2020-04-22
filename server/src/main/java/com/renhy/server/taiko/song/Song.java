package com.renhy.server.taiko.song;

import com.alibaba.fastjson.JSON;
import com.renhy.server.taiko.entity.Category;
import com.renhy.server.taiko.entity.SongEntity;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class Song {

    private String id;

    private String tag;

    private Category category;

    private String title;

    private String subTitle;

    private int bpm;

    private String wave;

    private Metadata metadata;

    private List<Integer> musicLevels;

    private Date createdAt;

    private String createdBy;

    private Date updatedAt;

    private String updatedBy;



    public static Song fromEntity(SongEntity entity) {
        Song song = new Song();
        song.setId(entity.getId());
        song.setTag(entity.getTag());
        song.setCategory(entity.getCategory());
        song.setTitle(entity.getTitle());
        song.setSubTitle(entity.getSubTitle());
        song.setBpm(entity.getBpm());
        song.setWave(entity.getWave());
        song.setMetadata(JSON.parseObject(entity.getMetadata(), Metadata.class));
        song.setMusicLevels(JSON.parseArray(entity.getMusicLevels(), Integer.class));
        song.setCreatedAt(entity.getCreatedAt());
        song.setCreatedBy(entity.getCreatedBy());
        song.setUpdatedAt(entity.getUpdatedAt());
        song.setUpdatedBy(entity.getUpdatedBy());

        return song;
    }


    @Data
    public static class Metadata {

        private double offset;

        private double songVol;

        private double seVol;

        private double demoStart;

    }

}
