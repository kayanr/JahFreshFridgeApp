package com.jahfresh.passionprojrest.controllers;

import com.jahfresh.passionprojrest.models.FoodItem;
import com.jahfresh.passionprojrest.models.FoodItemDto;
import com.jahfresh.passionprojrest.repositories.FoodItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("/fooditems")
public class FoodItemController {

    @Autowired
    private FoodItemRepo foodItemRepo;

    @GetMapping({"","/"})
    public String getFoodItems(Model model) {
        var foodItems = foodItemRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));
        model.addAttribute("fooditems", foodItems);
        return "fooditems/index";
    }

    @GetMapping("/create")
    public String createFoodItem(Model model) {
        FoodItemDto foodItemDto = new FoodItemDto();
        model.addAttribute("foodItemDto", foodItemDto);
        //foodItemRepo.save(foodItem);
        return "fooditems/create";
    }

    @PostMapping("/create")
        public String createFoodIem(@Valid FoodItemDto foodItemDto, BindingResult bindingResult) {
            if(bindingResult.hasErrors()) {
                return "fooditems/create";
            }

            FoodItem foodItem = new FoodItem();
            foodItem.setName(foodItemDto.getName());
            foodItem.setDescription(foodItemDto.getDescription());
            foodItem.setExpiryDate(foodItemDto.getExpiryDate());
            foodItem.setQuantity(foodItemDto.getQuantity());
            foodItemRepo.save(foodItem);
          return "redirect:/fooditems";
        }

    @GetMapping("/edit")
    public String editFoodItem(Model model, @RequestParam Long id) {
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if(foodItem == null) {
            return "redirect:/fooditems";
        }

        FoodItemDto foodItemDto = new FoodItemDto();
        foodItemDto.setName(foodItem.getName());
        foodItemDto.setDescription(foodItem.getDescription());
        foodItemDto.setExpiryDate(foodItem.getExpiryDate());
        foodItemDto.setQuantity(foodItem.getQuantity());

        model.addAttribute("foodItem", foodItem);
        model.addAttribute("foodItemDto", foodItemDto);

        return "fooditems/edit";
    }

    @PostMapping ("/edit")
    public String editFoodItem(Model model, @RequestParam Long id, @Valid FoodItemDto foodItemDto, BindingResult bindingResult) {
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
        if(foodItem == null) {
            return "redirect:/fooditems";
        }
        model.addAttribute("foodItem", foodItem);

        if(bindingResult.hasErrors()) {
            return "fooditems/edit";
        }

        //Update food item details
        foodItem.setName(foodItemDto.getName());
        foodItem.setDescription(foodItemDto.getDescription());
        foodItem.setExpiryDate(foodItemDto.getExpiryDate());
        foodItem.setQuantity(foodItemDto.getQuantity());

        foodItemRepo.save(foodItem);
        return "redirect:/fooditems";
    }

    @GetMapping("/delete")
    public String deleteFoodItem(@RequestParam Long id){
        FoodItem foodItem = foodItemRepo.findById(id).orElse(null);
       if(foodItem != null) {
           foodItemRepo.delete(foodItem);
       }

        return "redirect:/fooditems";
    }

}
