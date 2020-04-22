package com.renhy.server.taiko.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("song")
public class SongEntity extends Model<SongEntity> {

    private String id;

    private String tag;

    private Category category;

    private String title;

    private String subTitle;

    private int bpm;

    private String wave;

    private String metadata;

    private String musicLevels;

    private Date createdAt;

    private String createdBy;

    private Date updatedAt;

    private String updatedBy;

    private boolean deleted;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }
}
