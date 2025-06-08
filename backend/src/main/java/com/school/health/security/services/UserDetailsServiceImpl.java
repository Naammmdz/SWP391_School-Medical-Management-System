package com.school.health.security.services;

import com.school.health.entity.User;

import com.school.health.repository.UserRepository;
import com.school.health.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

     @Autowired
     private UserService userService;


     @Override
     @Transactional
     public UserDetails loadUserByUsername(String usernameOrEmailOrPhone) throws UsernameNotFoundException {
          User user;
          if (usernameOrEmailOrPhone.contains("@")) {
               user = userService.getUserByEmail(usernameOrEmailOrPhone)
                       .orElseThrow(() -> new UsernameNotFoundException("User not found"));
          } else {
               user = userService.getUserByPhone(usernameOrEmailOrPhone)
                       .orElseThrow(() -> new UsernameNotFoundException("User not found"));
          }
          return UserDetailsImpl.build(user);
     }
}
