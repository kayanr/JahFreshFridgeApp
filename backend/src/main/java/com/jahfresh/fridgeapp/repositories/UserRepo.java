package com.jahfresh.fridgeapp.repositories;

import com.jahfresh.fridgeapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}
