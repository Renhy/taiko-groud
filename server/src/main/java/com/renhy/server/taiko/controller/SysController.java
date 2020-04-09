package com.renhy.server.taiko.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sys")
public class SysController {

    @Value("${sys.version}")
    private String version;

    @RequestMapping(value = "/version", method = RequestMethod.GET)
    public String getSysVersion() {
        return version;
    }

}
