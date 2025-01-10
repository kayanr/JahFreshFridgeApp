package com.jahfresh.passionprojrest.Controller;


import com.jahfresh.passionprojrest.Models.User;
import com.jahfresh.passionprojrest.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class HomeController {

   /* @Autowired
    private UserRepo userRepo;*/

    @GetMapping( "/")
        public String home(){
            return "index";
    }

 /*  @GetMapping(value="/users")
    public List<User> getUsers(){
        return userRepo.findAll();
    }

       /* @GetMapping("/users")
        public String listUsers(Model model) {
            model.addAttribute("users", userRepo.getAllUsers());
            return "users"; }

    @PostMapping(value = "/save")
    public String saveUser(@RequestBody User user){
            userRepo.save(user);
            return "Saved...";
    }

    @PutMapping(value = "update/{id}")
    public String updateUser(@PathVariable long id, @RequestBody User user){
            User updateUser = userRepo.findById(id).get();
            updateUser.setFirstName(user.getFirstName());
            updateUser.setLastName(user.getLastName());
            updateUser.setEmail(user.getEmail());
            userRepo.save(updateUser);
            return "Updated...";
    }

    @DeleteMapping(value = "/delete/{id}")
    public String deleteUser(@PathVariable long id){
            User deleteUser = userRepo.findById(id).get();
            userRepo.delete(deleteUser);
            return "Deleted user with the id: "+id;
    }*/


}
