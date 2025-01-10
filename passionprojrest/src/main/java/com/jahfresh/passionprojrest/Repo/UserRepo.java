package com.jahfresh.passionprojrest.Repo;

import com.jahfresh.passionprojrest.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}
