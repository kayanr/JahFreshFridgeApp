package com.jahfresh.passionprojrest.models;

import jakarta.persistence.*;

@Entity
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private long id;

        @Column
        private String firstName;

        @Column
        private String lastName;

        @Column
        private String email;

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

}