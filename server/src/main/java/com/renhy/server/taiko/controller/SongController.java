package com.renhy.server.taiko.controller;

import com.renhy.server.taiko.common.Response;
import com.renhy.server.taiko.entity.Category;
import com.renhy.server.taiko.service.SongService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/song")
public class SongController {


    @Autowired
    private SongService songService;


    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Response list() {
        return Response.success(
                songService.list());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Response getById(@PathVariable("id") String id) {
        return Response.success(
                songService.getById(id));
    }



    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public Response upload(
            @RequestParam("song") MultipartFile song,
            @RequestParam(value = "wave", required = false) MultipartFile wave,
            @RequestParam(value = "category", defaultValue = "OTHER") Category category) {

        return Response.success(
                songService.load(category, song, wave));
    }


}
