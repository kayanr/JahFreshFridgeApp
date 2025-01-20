package com.jahfresh.passionprojrest.repositories;

import com.jahfresh.passionprojrest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}
