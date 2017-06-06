package com.example.demo;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.mvc.method.annotation.AbstractJsonpResponseBodyAdvice;

import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.Repository;
import org.eclipse.egit.github.core.service.RepositoryService;

@Controller
@RequestMapping("/api/v1")
public class Api {
    @Value("${github.token}") private String githubToken;

    @CrossOrigin
    @RequestMapping(
        headers = {"content-type=application/json"}, value = "/watch", method = RequestMethod.POST)
    public @ResponseBody Map<String, Integer>
    status(@RequestBody User user) {
        Map<String, Integer> data = new HashMap<String, Integer>();
        try {
            GitHubClient client = new GitHubClient();
            client.setOAuth2Token(githubToken);
            RepositoryService service = new RepositoryService(client);
            for (Repository repo : service.getRepositories(user.username)) {
                data.put(repo.getName(), repo.getWatchers());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return data;
    }

    @ControllerAdvice
    static class JsonpAdvice extends AbstractJsonpResponseBodyAdvice {
        public JsonpAdvice() {
            super("callback");
        }
    }
}
