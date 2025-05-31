package com.school.health.security.services;

import com.school.health.entity.User;
import com.school.health.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

     @Autowired
     private UserRepository userRepository;

     @Override
     @Transactional
     public UserDetails loadUserByUsername(String usernameOrEmailOrPhone) throws UsernameNotFoundException {
          User user;

          //Check email or phone
          if (usernameOrEmailOrPhone.contains("@")) {
               user = userRepository.findByEmail(usernameOrEmailOrPhone)
                       .orElseThrow(()->new UsernameNotFoundException("User Not Found with email: " + usernameOrEmailOrPhone));
          } else {
               user = userRepository.findByPhone(usernameOrEmailOrPhone)
                       .orElseThrow(()->new UsernameNotFoundException("User Not Found with Phone: " + usernameOrEmailOrPhone));
          }

          return UserDetailsImpl.build(user);
     }

}
