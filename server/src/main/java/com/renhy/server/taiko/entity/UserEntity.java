package com.renhy.server.taiko.entity;

import com.baomidou.mybatisplus.activerecord.Model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserEntity extends Model<UserEntity> {

    private String id;

    private String loginName;

    private String password;

    private boolean admin;

    private String name;

    private String cellphone;

    private String avatar;

    private boolean deleted;

    private String createdBy;

    private Date createdAt;

    private String updatedBy;

    private Date updatedAt;


    @Override
    protected Serializable pkVal() {
        return this.id;
    }
}
