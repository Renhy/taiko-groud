package com.renhy.server.taiko.entity;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "song")
public class Song {

    @Id
    private String id;

    private String title;

    private String subTitle;


}
