const testStudents = 
    [
        {
            "firstName": "Eric",
            "middleName": "Whitney",
            "lastName": "Brown",
            "fullName": "Eric Whitney Brown",
            "collegeEmail": "eric.brown0@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4032957126788035",
            "rollNo": "ROLL001",
            "dob": "2003-08-03",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "395420668170",
            "mobileNumber": "+1-989-360-2684x29688",
            "personalEmail": "lmartinez@example.net",
            "dept": "AIDS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 0,
            "ugCgpa": 7.41,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 62.25,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 88.8,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "C2"
                }
            },
            "address": {
                "city": "Cooperhaven",
                "state": "Hawaii"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Donald",
            "middleName": "",
            "lastName": "Murray",
            "fullName": "Donald Murray",
            "collegeEmail": "donald.murray1@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4565394018550175",
            "rollNo": "ROLL002",
            "dob": "2003-12-04",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "608694949662",
            "mobileNumber": "3913791655",
            "personalEmail": "heather83@example.com",
            "dept": "BME",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 3,
            "ugCgpa": 5.15,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 82.67,
                    "board": "ICSC",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 90.38,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Port Heather",
                "state": "Colorado"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Stanley",
            "middleName": "Katherine",
            "lastName": "Phillips",
            "fullName": "Stanley Katherine Phillips",
            "collegeEmail": "stanley.phillips2@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1160289717415517",
            "rollNo": "ROLL003",
            "dob": "2004-03-21",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "571695145117",
            "mobileNumber": "866.356.7328x777",
            "personalEmail": "matthewacevedo@example.com",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 4,
            "currentArrears": 3,
            "ugCgpa": 5.74,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 71.14,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 66.95,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Pinedaborough",
                "state": "Florida"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Michael",
            "middleName": "",
            "lastName": "Bryant",
            "fullName": "Michael Bryant",
            "collegeEmail": "michael.bryant3@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2178215601447385",
            "rollNo": "ROLL004",
            "dob": "2006-10-21",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "558115188654",
            "mobileNumber": "+1-918-696-9429x45234",
            "personalEmail": "sylvia96@example.org",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 0,
            "ugCgpa": 8.84,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 92.97,
                    "board": "ICSC",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 66.67,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Lake Michele",
                "state": "Indiana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "William",
            "middleName": "",
            "lastName": "Rivera",
            "fullName": "William Rivera",
            "collegeEmail": "william.rivera4@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4784753659207595",
            "rollNo": "ROLL005",
            "dob": "2004-07-12",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "471020746611",
            "mobileNumber": "464-564-0314x7501",
            "personalEmail": "mary38@example.org",
            "dept": "CSE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 8.98,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 86.24,
                    "board": "NEB",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 70.73,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "A2"
                }
            },
            "address": {
                "city": "West Linda",
                "state": "New Hampshire"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Eric",
            "middleName": "Jessica",
            "lastName": "Johnson",
            "fullName": "Eric Jessica Johnson",
            "collegeEmail": "eric.johnson5@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9637853031511759",
            "rollNo": "ROLL006",
            "dob": "2005-02-28",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "109352098823",
            "mobileNumber": "001-201-986-9258x32336",
            "personalEmail": "amanda26@example.com",
            "dept": "AIDS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 1,
            "ugCgpa": 9.23,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 61.95,
                    "board": "NEB",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 89.62,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Jacobberg",
                "state": "North Dakota"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Allison",
            "middleName": "",
            "lastName": "Jackson",
            "fullName": "Allison Jackson",
            "collegeEmail": "allison.jackson6@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9097140835158147",
            "rollNo": "ROLL007",
            "dob": "2006-09-24",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "359349403998",
            "mobileNumber": "449.641.8884x8613",
            "personalEmail": "patrick00@example.org",
            "dept": "ECE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 3,
            "ugCgpa": 8.91,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 85.85,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 77.45,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "South Clinton",
                "state": "Mississippi"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Michelle",
            "middleName": "Matthew",
            "lastName": "Martin",
            "fullName": "Michelle Matthew Martin",
            "collegeEmail": "michelle.martin7@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "7832280030711691",
            "rollNo": "ROLL008",
            "dob": "2003-04-23",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "762286960144",
            "mobileNumber": "738-891-8897",
            "personalEmail": "henryedwin@example.com",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 2,
            "currentArrears": 3,
            "ugCgpa": 6.05,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 89.44,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 66.48,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Gibbshaven",
                "state": "Oregon"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Michelle",
            "middleName": "",
            "lastName": "Bell",
            "fullName": "Michelle Bell",
            "collegeEmail": "michelle.bell8@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9434291455576569",
            "rollNo": "ROLL009",
            "dob": "2004-05-27",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "831037953191",
            "mobileNumber": "(655)888-9847",
            "personalEmail": "fhuffman@example.org",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 5,
            "currentArrears": 1,
            "ugCgpa": 5.15,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 94.87,
                    "board": "others",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 89.64,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Steventown",
                "state": "Idaho"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Pamela",
            "middleName": "Kristopher",
            "lastName": "Vaughan",
            "fullName": "Pamela Kristopher Vaughan",
            "collegeEmail": "pamela.vaughan9@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8185368044213110",
            "rollNo": "ROLL010",
            "dob": "2004-05-05",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "680122769490",
            "mobileNumber": "435.632.2505x08914",
            "personalEmail": "sflowers@example.org",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 4,
            "currentArrears": 3,
            "ugCgpa": 6.65,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 82.52,
                    "board": "State",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 64.23,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Amandahaven",
                "state": "Montana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Justin",
            "middleName": "",
            "lastName": "Walker",
            "fullName": "Justin Walker",
            "collegeEmail": "justin.walker10@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "5898155228945882",
            "rollNo": "ROLL011",
            "dob": "2001-10-06",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "497904104031",
            "mobileNumber": "3184948307",
            "personalEmail": "jonathan42@example.com",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 2,
            "currentArrears": 0,
            "ugCgpa": 6.91,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 82.69,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 79.14,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Simpsonfort",
                "state": "Ohio"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Vickie",
            "middleName": "",
            "lastName": "Wise",
            "fullName": "Vickie Wise",
            "collegeEmail": "vickie.wise11@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2284171002342688",
            "rollNo": "ROLL012",
            "dob": "2005-02-22",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "760761776637",
            "mobileNumber": "983.249.6819",
            "personalEmail": "sandersjoseph@example.org",
            "dept": "Cyber Security",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 1,
            "ugCgpa": 5.5,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 65.22,
                    "board": "CBSE",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 96.93,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Michaelchester",
                "state": "New Jersey"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "David",
            "middleName": "Tracy",
            "lastName": "Nash",
            "fullName": "David Tracy Nash",
            "collegeEmail": "david.nash12@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1139658780041500",
            "rollNo": "ROLL013",
            "dob": "2004-01-13",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "236317241234",
            "mobileNumber": "(405)725-5144",
            "personalEmail": "toddscott@example.org",
            "dept": "CIVIL",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 0,
            "ugCgpa": 9.28,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 62.45,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 92.32,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Port Stacey",
                "state": "Louisiana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Hector",
            "middleName": "",
            "lastName": "Jackson",
            "fullName": "Hector Jackson",
            "collegeEmail": "hector.jackson13@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "7816816638864469",
            "rollNo": "ROLL014",
            "dob": "2003-09-01",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "319675323738",
            "mobileNumber": "001-894-227-1684x180",
            "personalEmail": "thompsonvictoria@example.org",
            "dept": "Mechanical",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 5,
            "currentArrears": 1,
            "ugCgpa": 5.31,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 85.19,
                    "board": "State",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 77.82,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Samanthaport",
                "state": "Louisiana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Ronald",
            "middleName": "Cole",
            "lastName": "Wright",
            "fullName": "Ronald Cole Wright",
            "collegeEmail": "ronald.wright14@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4734764537013398",
            "rollNo": "ROLL015",
            "dob": "2006-09-14",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "106828401414",
            "mobileNumber": "+1-729-704-4035x9619",
            "personalEmail": "victoria36@example.net",
            "dept": "ECE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 1,
            "currentArrears": 3,
            "ugCgpa": 6.95,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 83.29,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 87.92,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Port Sherifurt",
                "state": "Montana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Christopher",
            "middleName": "",
            "lastName": "Davies",
            "fullName": "Christopher Davies",
            "collegeEmail": "christopher.davies15@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4289275859605437",
            "rollNo": "ROLL016",
            "dob": "2006-10-12",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "229551148890",
            "mobileNumber": "538-719-5671",
            "personalEmail": "christine18@example.com",
            "dept": "CSE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 1,
            "ugCgpa": 5.2,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 72.15,
                    "board": "NEB",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 60.07,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "A2"
                }
            },
            "address": {
                "city": "East Julie",
                "state": "Missouri"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jason",
            "middleName": "Tanya",
            "lastName": "Bradley",
            "fullName": "Jason Tanya Bradley",
            "collegeEmail": "jason.bradley16@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8286546087656361",
            "rollNo": "ROLL017",
            "dob": "2001-12-30",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "915218684237",
            "mobileNumber": "499.944.2171x864",
            "personalEmail": "longgeorge@example.org",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 3,
            "currentArrears": 3,
            "ugCgpa": 8.03,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 60.83,
                    "board": "ICSC",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 61.57,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "South Christine",
                "state": "South Carolina"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Douglas",
            "middleName": "",
            "lastName": "Miller",
            "fullName": "Douglas Miller",
            "collegeEmail": "douglas.miller17@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "2581269664292684",
            "rollNo": "ROLL018",
            "dob": "2005-01-19",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "968116645887",
            "mobileNumber": "001-660-766-5531x11782",
            "personalEmail": "zfrancis@example.org",
            "dept": "AIDS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 4,
            "currentArrears": 2,
            "ugCgpa": 6.09,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 74.45,
                    "board": "others",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 84.44,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Port Angelville",
                "state": "Oklahoma"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Teresa",
            "middleName": "",
            "lastName": "Sutton",
            "fullName": "Teresa Sutton",
            "collegeEmail": "teresa.sutton18@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "3065204060995919",
            "rollNo": "ROLL019",
            "dob": "2006-08-01",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "644927006429",
            "mobileNumber": "410.454.1895x8292",
            "personalEmail": "jonesdavid@example.org",
            "dept": "CSBS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 4,
            "currentArrears": 1,
            "ugCgpa": 8.28,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 82.29,
                    "board": "NEB",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 90.29,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Leemouth",
                "state": "Wyoming"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Mark",
            "middleName": "",
            "lastName": "Garcia",
            "fullName": "Mark Garcia",
            "collegeEmail": "mark.garcia19@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4059704889541527",
            "rollNo": "ROLL020",
            "dob": "2003-08-02",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "352763694248",
            "mobileNumber": "(780)481-3357x59148",
            "personalEmail": "browndonna@example.org",
            "dept": "AIML",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 8.44,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 70.32,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 95.21,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N4"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Lopezbury",
                "state": "Oregon"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Roy",
            "middleName": "Heather",
            "lastName": "Horton",
            "fullName": "Roy Heather Horton",
            "collegeEmail": "roy.horton20@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4213631823075163",
            "rollNo": "ROLL021",
            "dob": "2006-09-11",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "621270049431",
            "mobileNumber": "311.246.6706x8997",
            "personalEmail": "sabrinarivera@example.com",
            "dept": "EEE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 2,
            "currentArrears": 3,
            "ugCgpa": 5.41,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 79.42,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 94.99,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "North Richardborough",
                "state": "North Dakota"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Timothy",
            "middleName": "",
            "lastName": "Ware",
            "fullName": "Timothy Ware",
            "collegeEmail": "timothy.ware21@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "8857684046965155",
            "rollNo": "ROLL022",
            "dob": "2006-03-25",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "233054920406",
            "mobileNumber": "452-546-4817x382",
            "personalEmail": "mmeyers@example.org",
            "dept": "CHEM",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 8.24,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 68.22,
                    "board": "NEB",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 89.48,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Port Karenview",
                "state": "California"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Kathleen",
            "middleName": "",
            "lastName": "Wright",
            "fullName": "Kathleen Wright",
            "collegeEmail": "kathleen.wright22@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "7149316701595767",
            "rollNo": "ROLL023",
            "dob": "2006-09-22",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "983333946487",
            "mobileNumber": "222-492-4349",
            "personalEmail": "velliott@example.net",
            "dept": "CHEM",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 3,
            "currentArrears": 3,
            "ugCgpa": 8.79,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 66.26,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 85.13,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Littlefort",
                "state": "Delaware"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Kristen",
            "middleName": "",
            "lastName": "Hughes",
            "fullName": "Kristen Hughes",
            "collegeEmail": "kristen.hughes23@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "6918279442676347",
            "rollNo": "ROLL024",
            "dob": "2005-09-25",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "439439648509",
            "mobileNumber": "(524)764-6306x94680",
            "personalEmail": "gpeterson@example.com",
            "dept": "Cyber Security",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 0,
            "currentArrears": 1,
            "ugCgpa": 6.87,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 72.17,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 61.49,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Briannaside",
                "state": "Virginia"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Nicholas",
            "middleName": "",
            "lastName": "Reyes",
            "fullName": "Nicholas Reyes",
            "collegeEmail": "nicholas.reyes24@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4600935958971278",
            "rollNo": "ROLL025",
            "dob": "2005-09-05",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "378907996024",
            "mobileNumber": "6124271001",
            "personalEmail": "qallen@example.net",
            "dept": "AIML",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 3,
            "currentArrears": 3,
            "ugCgpa": 8.36,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 98.19,
                    "board": "NEB",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 92.43,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Moralesmouth",
                "state": "California"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Melissa",
            "middleName": "Craig",
            "lastName": "Elliott",
            "fullName": "Melissa Craig Elliott",
            "collegeEmail": "melissa.elliott25@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "3810558914476827",
            "rollNo": "ROLL026",
            "dob": "2003-06-04",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "441842967029",
            "mobileNumber": "326-695-2658x045",
            "personalEmail": "stewartterrence@example.org",
            "dept": "CSBS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 4,
            "currentArrears": 1,
            "ugCgpa": 9.27,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 97.0,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 85.87,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Scottstad",
                "state": "North Carolina"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jasmine",
            "middleName": "",
            "lastName": "Yates",
            "fullName": "Jasmine Yates",
            "collegeEmail": "jasmine.yates26@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4060164913126293",
            "rollNo": "ROLL027",
            "dob": "2002-04-29",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "993969760783",
            "mobileNumber": "712.718.9365",
            "personalEmail": "ehart@example.com",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 3,
            "ugCgpa": 8.73,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 83.45,
                    "board": "others",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 65.22,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "South Nancy",
                "state": "Hawaii"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Brian",
            "middleName": "",
            "lastName": "Oconnor",
            "fullName": "Brian Oconnor",
            "collegeEmail": "brian.oconnor27@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9605639162677851",
            "rollNo": "ROLL028",
            "dob": "2007-01-20",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "933818993932",
            "mobileNumber": "001-553-920-4754x396",
            "personalEmail": "lynchnathan@example.org",
            "dept": "CHEM",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 5.3,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 82.49,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 88.79,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "North Heather",
                "state": "Virginia"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jessica",
            "middleName": "",
            "lastName": "Ingram",
            "fullName": "Jessica Ingram",
            "collegeEmail": "jessica.ingram28@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "2645482043488251",
            "rollNo": "ROLL029",
            "dob": "2004-08-14",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "476232921233",
            "mobileNumber": "+1-711-922-6392",
            "personalEmail": "bethanykline@example.com",
            "dept": "AIDS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 2,
            "currentArrears": 1,
            "ugCgpa": 6.83,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 92.18,
                    "board": "State",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 69.08,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Melissachester",
                "state": "Hawaii"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Ryan",
            "middleName": "",
            "lastName": "Cook",
            "fullName": "Ryan Cook",
            "collegeEmail": "ryan.cook29@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4544489068030395",
            "rollNo": "ROLL030",
            "dob": "2002-10-09",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "346744574673",
            "mobileNumber": "+1-874-925-4708",
            "personalEmail": "kristiortega@example.com",
            "dept": "EEE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 4,
            "currentArrears": 2,
            "ugCgpa": 7.75,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 96.85,
                    "board": "CBSE",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 90.76,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "West Aaronview",
                "state": "West Virginia"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Paul",
            "middleName": "Robert",
            "lastName": "Miller",
            "fullName": "Paul Robert Miller",
            "collegeEmail": "paul.miller30@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1465698265822175",
            "rollNo": "ROLL031",
            "dob": "2005-09-01",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "395950436305",
            "mobileNumber": "4509167829",
            "personalEmail": "ericpatterson@example.org",
            "dept": "AIDS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 9.57,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 86.09,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 92.97,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "West William",
                "state": "New Hampshire"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Teresa",
            "middleName": "",
            "lastName": "Hughes",
            "fullName": "Teresa Hughes",
            "collegeEmail": "teresa.hughes31@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9841232801256715",
            "rollNo": "ROLL032",
            "dob": "2005-08-20",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "167822143520",
            "mobileNumber": "323-499-6648x857",
            "personalEmail": "carolynjordan@example.org",
            "dept": "Mechanical",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 6.27,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 62.44,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 63.64,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": false,
                    "level": "C2"
                }
            },
            "address": {
                "city": "Lake Michaelville",
                "state": "Wisconsin"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Bryan",
            "middleName": "Thomas",
            "lastName": "Andersen",
            "fullName": "Bryan Thomas Andersen",
            "collegeEmail": "bryan.andersen32@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "5340894330108043",
            "rollNo": "ROLL033",
            "dob": "2006-09-03",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "297423443052",
            "mobileNumber": "(299)303-2286x2256",
            "personalEmail": "andersonthomas@example.com",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 2,
            "currentArrears": 3,
            "ugCgpa": 9.59,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 82.48,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 73.38,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "C2"
                }
            },
            "address": {
                "city": "Aguirrestad",
                "state": "Wyoming"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Angel",
            "middleName": "John",
            "lastName": "Lucas",
            "fullName": "Angel John Lucas",
            "collegeEmail": "angel.lucas33@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9920303017204034",
            "rollNo": "ROLL034",
            "dob": "2002-03-12",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "884800368508",
            "mobileNumber": "(930)676-4437",
            "personalEmail": "johnmorgan@example.org",
            "dept": "IT",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 0,
            "ugCgpa": 8.98,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 91.73,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 80.22,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Port Matthewland",
                "state": "Tennessee"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Veronica",
            "middleName": "",
            "lastName": "Sloan",
            "fullName": "Veronica Sloan",
            "collegeEmail": "veronica.sloan34@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4085659284976262",
            "rollNo": "ROLL035",
            "dob": "2005-07-16",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "568261364946",
            "mobileNumber": "330.414.9608",
            "personalEmail": "campbellrick@example.net",
            "dept": "AIDS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 9.76,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 61.46,
                    "board": "others",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 89.17,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Lake Gregory",
                "state": "Illinois"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Ricardo",
            "middleName": "Troy",
            "lastName": "Miller",
            "fullName": "Ricardo Troy Miller",
            "collegeEmail": "ricardo.miller35@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8428959238934181",
            "rollNo": "ROLL036",
            "dob": "2007-08-24",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "982469384373",
            "mobileNumber": "(635)623-1511x23561",
            "personalEmail": "cynthiaparks@example.com",
            "dept": "ECE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 0,
            "ugCgpa": 8.83,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 65.56,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 72.74,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "East Amy",
                "state": "South Dakota"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Javier",
            "middleName": "Thomas",
            "lastName": "Stafford",
            "fullName": "Javier Thomas Stafford",
            "collegeEmail": "javier.stafford36@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2187098152607175",
            "rollNo": "ROLL037",
            "dob": "2004-08-22",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "862309727644",
            "mobileNumber": "001-370-512-3934x74117",
            "personalEmail": "jjennings@example.net",
            "dept": "Cyber Security",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 1,
            "currentArrears": 3,
            "ugCgpa": 9.2,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 72.17,
                    "board": "others",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 94.6,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Lake Davidburgh",
                "state": "Minnesota"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Angela",
            "middleName": "",
            "lastName": "Rodriguez",
            "fullName": "Angela Rodriguez",
            "collegeEmail": "angela.rodriguez37@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "7163837104441594",
            "rollNo": "ROLL038",
            "dob": "2007-01-04",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "448233990575",
            "mobileNumber": "+1-496-308-8381x72873",
            "personalEmail": "scotttimothy@example.com",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 4,
            "currentArrears": 3,
            "ugCgpa": 7.08,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 64.49,
                    "board": "others",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 91.78,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Lake Kenneth",
                "state": "New Mexico"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Teresa",
            "middleName": "",
            "lastName": "Leblanc",
            "fullName": "Teresa Leblanc",
            "collegeEmail": "teresa.leblanc38@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "3398248363465827",
            "rollNo": "ROLL039",
            "dob": "2006-04-26",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "626841811921",
            "mobileNumber": "589.914.9315",
            "personalEmail": "davidbutler@example.org",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 4,
            "currentArrears": 3,
            "ugCgpa": 5.71,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 77.34,
                    "board": "CBSE",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 92.66,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Leburgh",
                "state": "Alaska"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Amanda",
            "middleName": "",
            "lastName": "Hood",
            "fullName": "Amanda Hood",
            "collegeEmail": "amanda.hood39@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "2647978480432558",
            "rollNo": "ROLL040",
            "dob": "2004-10-15",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "270368821216",
            "mobileNumber": "(576)253-4577x13782",
            "personalEmail": "justin41@example.org",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 0,
            "ugCgpa": 7.58,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 74.04,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 70.07,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Port Charlesshire",
                "state": "New Jersey"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Melvin",
            "middleName": "",
            "lastName": "Summers",
            "fullName": "Melvin Summers",
            "collegeEmail": "melvin.summers40@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "7055939551692346",
            "rollNo": "ROLL041",
            "dob": "2002-02-21",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "346550555307",
            "mobileNumber": "001-380-821-7570x180",
            "personalEmail": "jeffrey44@example.com",
            "dept": "CSBS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 3,
            "currentArrears": 0,
            "ugCgpa": 9.11,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 74.25,
                    "board": "State",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 91.09,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "New Kevin",
                "state": "Massachusetts"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Gail",
            "middleName": "Amber",
            "lastName": "Nguyen",
            "fullName": "Gail Amber Nguyen",
            "collegeEmail": "gail.nguyen41@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2212950414482028",
            "rollNo": "ROLL042",
            "dob": "2006-10-30",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "748441094899",
            "mobileNumber": "+1-389-337-9365x097",
            "personalEmail": "timothysmith@example.org",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 4,
            "currentArrears": 2,
            "ugCgpa": 8.13,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 77.3,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 85.76,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "New Nicole",
                "state": "New York"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Erik",
            "middleName": "",
            "lastName": "Holden",
            "fullName": "Erik Holden",
            "collegeEmail": "erik.holden42@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "5365174845784425",
            "rollNo": "ROLL043",
            "dob": "2007-02-08",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "995240672959",
            "mobileNumber": "001-737-494-8258x8829",
            "personalEmail": "natalie07@example.org",
            "dept": "AIML",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 3,
            "ugCgpa": 5.56,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 63.6,
                    "board": "others",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 95.44,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "New John",
                "state": "Rhode Island"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Caitlin",
            "middleName": "",
            "lastName": "Roberts",
            "fullName": "Caitlin Roberts",
            "collegeEmail": "caitlin.roberts43@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9754012314904741",
            "rollNo": "ROLL044",
            "dob": "2003-12-02",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "871748262205",
            "mobileNumber": "624.814.0971",
            "personalEmail": "reyesoscar@example.org",
            "dept": "BME",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 4,
            "currentArrears": 0,
            "ugCgpa": 7.25,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 98.27,
                    "board": "NEB",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 64.28,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Richardfort",
                "state": "Nebraska"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Janice",
            "middleName": "",
            "lastName": "Richardson",
            "fullName": "Janice Richardson",
            "collegeEmail": "janice.richardson44@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1223914116436622",
            "rollNo": "ROLL045",
            "dob": "2002-04-18",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "937352417270",
            "mobileNumber": "(244)536-3193",
            "personalEmail": "lisagross@example.com",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 2,
            "ugCgpa": 8.77,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 81.79,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 63.1,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "New Jeffrey",
                "state": "Vermont"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Kristin",
            "middleName": "Jeff",
            "lastName": "Kennedy",
            "fullName": "Kristin Jeff Kennedy",
            "collegeEmail": "kristin.kennedy45@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8077685592726714",
            "rollNo": "ROLL046",
            "dob": "2003-12-06",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "738159559739",
            "mobileNumber": "001-500-987-6143x304",
            "personalEmail": "leslieallen@example.org",
            "dept": "AIDS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 0,
            "ugCgpa": 5.75,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 91.67,
                    "board": "CBSE",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 75.67,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "East Michael",
                "state": "Louisiana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Bradley",
            "middleName": "",
            "lastName": "Morris",
            "fullName": "Bradley Morris",
            "collegeEmail": "bradley.morris46@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "5335357901464400",
            "rollNo": "ROLL047",
            "dob": "2007-02-28",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "653090787772",
            "mobileNumber": "242.570.2336",
            "personalEmail": "iharmon@example.net",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 4,
            "currentArrears": 2,
            "ugCgpa": 6.92,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 71.71,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 95.09,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Morganmouth",
                "state": "Utah"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Samuel",
            "middleName": "John",
            "lastName": "Manning",
            "fullName": "Samuel John Manning",
            "collegeEmail": "samuel.manning47@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9888135381781662",
            "rollNo": "ROLL048",
            "dob": "2002-03-26",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "749901261696",
            "mobileNumber": "001-223-662-0821x25244",
            "personalEmail": "theresamoore@example.org",
            "dept": "Cyber Security",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 5.78,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 71.04,
                    "board": "NEB",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 78.09,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Port Deborahfort",
                "state": "Washington"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Carrie",
            "middleName": "Lisa",
            "lastName": "Brock",
            "fullName": "Carrie Lisa Brock",
            "collegeEmail": "carrie.brock48@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2014220415926162",
            "rollNo": "ROLL049",
            "dob": "2003-04-21",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "456087805489",
            "mobileNumber": "724.437.7507x05095",
            "personalEmail": "ortizdalton@example.com",
            "dept": "CHEM",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 0,
            "currentArrears": 1,
            "ugCgpa": 7.18,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 66.21,
                    "board": "CBSE",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 85.3,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Skinnerside",
                "state": "Delaware"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Elizabeth",
            "middleName": "",
            "lastName": "Logan",
            "fullName": "Elizabeth Logan",
            "collegeEmail": "elizabeth.logan49@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "3606357492239060",
            "rollNo": "ROLL050",
            "dob": "2002-06-22",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "681231006015",
            "mobileNumber": "(522)694-8557",
            "personalEmail": "ricardoarnold@example.net",
            "dept": "BME",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 1,
            "currentArrears": 1,
            "ugCgpa": 8.33,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 75.51,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 77.81,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "South Marybury",
                "state": "Delaware"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Nicole",
            "middleName": "Stephanie",
            "lastName": "Wong",
            "fullName": "Nicole Stephanie Wong",
            "collegeEmail": "nicole.wong50@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9593150270635894",
            "rollNo": "ROLL051",
            "dob": "2003-02-28",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "478489633492",
            "mobileNumber": "+1-978-529-6498x962",
            "personalEmail": "gyork@example.org",
            "dept": "Mechanical",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 3,
            "currentArrears": 0,
            "ugCgpa": 5.96,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 85.82,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 97.18,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Andrewhaven",
                "state": "Vermont"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "William",
            "middleName": "Jacqueline",
            "lastName": "Salazar",
            "fullName": "William Jacqueline Salazar",
            "collegeEmail": "william.salazar51@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1289069104227480",
            "rollNo": "ROLL052",
            "dob": "2007-01-06",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "588525273599",
            "mobileNumber": "790-347-0704",
            "personalEmail": "daniel52@example.com",
            "dept": "IT",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 7.67,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 74.75,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 88.63,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Valenciafurt",
                "state": "Colorado"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Mary",
            "middleName": "Jose",
            "lastName": "Hansen",
            "fullName": "Mary Jose Hansen",
            "collegeEmail": "mary.hansen52@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "5487417605291917",
            "rollNo": "ROLL053",
            "dob": "2004-06-28",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "443018870884",
            "mobileNumber": "(323)367-1040",
            "personalEmail": "shopkins@example.net",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 1,
            "currentArrears": 1,
            "ugCgpa": 9.71,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 68.39,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 81.56,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Port Michelleborough",
                "state": "Nebraska"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jonathan",
            "middleName": "Eric",
            "lastName": "Frye",
            "fullName": "Jonathan Eric Frye",
            "collegeEmail": "jonathan.frye53@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2194412408260480",
            "rollNo": "ROLL054",
            "dob": "2004-07-19",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "218022825106",
            "mobileNumber": "(695)427-2708x513",
            "personalEmail": "margaret49@example.org",
            "dept": "EEE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 3,
            "currentArrears": 1,
            "ugCgpa": 9.9,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 90.08,
                    "board": "others",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 61.55,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Danatown",
                "state": "Vermont"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jose",
            "middleName": "",
            "lastName": "Boyer",
            "fullName": "Jose Boyer",
            "collegeEmail": "jose.boyer54@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "1273610159868700",
            "rollNo": "ROLL055",
            "dob": "2004-05-09",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "858625625186",
            "mobileNumber": "570.711.5216",
            "personalEmail": "murrayelizabeth@example.com",
            "dept": "Mechanical",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 3,
            "currentArrears": 0,
            "ugCgpa": 5.56,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 61.27,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 87.58,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Carriemouth",
                "state": "Arkansas"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Kylie",
            "middleName": "Joseph",
            "lastName": "Aguilar",
            "fullName": "Kylie Joseph Aguilar",
            "collegeEmail": "kylie.aguilar55@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4000755843039666",
            "rollNo": "ROLL056",
            "dob": "2002-11-27",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "764031322509",
            "mobileNumber": "846-496-5324x1529",
            "personalEmail": "johnsonronald@example.org",
            "dept": "BME",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 6.58,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 68.69,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 92.58,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "C2"
                }
            },
            "address": {
                "city": "Stephenfurt",
                "state": "Florida"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Sheila",
            "middleName": "",
            "lastName": "Stone",
            "fullName": "Sheila Stone",
            "collegeEmail": "sheila.stone56@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "5290111458791075",
            "rollNo": "ROLL057",
            "dob": "2003-07-18",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "172779134759",
            "mobileNumber": "625-405-1902x20460",
            "personalEmail": "xgonzales@example.net",
            "dept": "CIVIL",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 8.97,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 99.97,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 62.93,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "South Alison",
                "state": "Louisiana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Craig",
            "middleName": "",
            "lastName": "Tanner",
            "fullName": "Craig Tanner",
            "collegeEmail": "craig.tanner57@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1731982718486907",
            "rollNo": "ROLL058",
            "dob": "2004-06-10",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "246093817206",
            "mobileNumber": "001-466-231-0503",
            "personalEmail": "tkeller@example.net",
            "dept": "CSBS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 5.66,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 98.62,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 93.09,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "East Denisechester",
                "state": "Washington"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "John",
            "middleName": "Teresa",
            "lastName": "Jordan",
            "fullName": "John Teresa Jordan",
            "collegeEmail": "john.jordan58@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4248429634681200",
            "rollNo": "ROLL059",
            "dob": "2005-01-15",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "352139584737",
            "mobileNumber": "9079231293",
            "personalEmail": "rperez@example.com",
            "dept": "BME",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 2,
            "ugCgpa": 6.09,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 74.38,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 96.83,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "A2"
                }
            },
            "address": {
                "city": "South Isaiahstad",
                "state": "North Dakota"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Christopher",
            "middleName": "Emma",
            "lastName": "Melton",
            "fullName": "Christopher Emma Melton",
            "collegeEmail": "christopher.melton59@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "6913469752833837",
            "rollNo": "ROLL060",
            "dob": "2006-04-30",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "434569544567",
            "mobileNumber": "001-876-734-9073x7252",
            "personalEmail": "davismichelle@example.org",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 4,
            "currentArrears": 0,
            "ugCgpa": 8.5,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 85.78,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 93.65,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Bakerside",
                "state": "North Carolina"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Christopher",
            "middleName": "",
            "lastName": "Sims",
            "fullName": "Christopher Sims",
            "collegeEmail": "christopher.sims60@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2451407602027856",
            "rollNo": "ROLL061",
            "dob": "2004-02-03",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "974973055901",
            "mobileNumber": "9742303141",
            "personalEmail": "gbenitez@example.net",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 6.33,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 67.93,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 80.11,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Marshallfurt",
                "state": "Montana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Cassandra",
            "middleName": "Samantha",
            "lastName": "Andrews",
            "fullName": "Cassandra Samantha Andrews",
            "collegeEmail": "cassandra.andrews61@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4737848602924210",
            "rollNo": "ROLL062",
            "dob": "2003-07-14",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "696059998937",
            "mobileNumber": "001-547-505-1093x0202",
            "personalEmail": "shari85@example.org",
            "dept": "ECE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 9.69,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 72.21,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 60.19,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Carlosshire",
                "state": "Washington"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Cheryl",
            "middleName": "",
            "lastName": "Oconnor",
            "fullName": "Cheryl Oconnor",
            "collegeEmail": "cheryl.oconnor62@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9039243666916158",
            "rollNo": "ROLL063",
            "dob": "2002-12-17",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "534357763721",
            "mobileNumber": "469-701-5165",
            "personalEmail": "jennifer90@example.net",
            "dept": "CSE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 7.71,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 96.71,
                    "board": "others",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 61.58,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": true,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Bryantown",
                "state": "New Mexico"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Melissa",
            "middleName": "",
            "lastName": "Cooley",
            "fullName": "Melissa Cooley",
            "collegeEmail": "melissa.cooley63@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4527542728286151",
            "rollNo": "ROLL064",
            "dob": "2004-08-15",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "883655882126",
            "mobileNumber": "576.890.5978x325",
            "personalEmail": "walshangelica@example.net",
            "dept": "CSBS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 2,
            "ugCgpa": 8.02,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 79.94,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 94.2,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Lake Jeremybury",
                "state": "Utah"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Amy",
            "middleName": "Robert",
            "lastName": "Mcconnell",
            "fullName": "Amy Robert Mcconnell",
            "collegeEmail": "amy.mcconnell64@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "5597563466672739",
            "rollNo": "ROLL065",
            "dob": "2003-03-01",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "906559892188",
            "mobileNumber": "+1-694-571-8169x45129",
            "personalEmail": "jennifer00@example.com",
            "dept": "ECE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 1,
            "currentArrears": 3,
            "ugCgpa": 9.41,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 81.44,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 82.47,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "C2"
                }
            },
            "address": {
                "city": "Michaelshire",
                "state": "Michigan"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Melinda",
            "middleName": "",
            "lastName": "Erickson",
            "fullName": "Melinda Erickson",
            "collegeEmail": "melinda.erickson65@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "3359406062306406",
            "rollNo": "ROLL066",
            "dob": "2004-11-21",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "347542233337",
            "mobileNumber": "+1-307-948-7233x9286",
            "personalEmail": "katherine14@example.com",
            "dept": "BME",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 5.67,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 74.6,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 90.4,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Port Mitchell",
                "state": "Alabama"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Michael",
            "middleName": "Crystal",
            "lastName": "Mckee",
            "fullName": "Michael Crystal Mckee",
            "collegeEmail": "michael.mckee66@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "8622281309287859",
            "rollNo": "ROLL067",
            "dob": "2004-01-05",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "666112803065",
            "mobileNumber": "(892)780-7356x16650",
            "personalEmail": "valdezerik@example.net",
            "dept": "AIML",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 2,
            "currentArrears": 1,
            "ugCgpa": 8.37,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 73.52,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 82.19,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "East Christina",
                "state": "Pennsylvania"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Amanda",
            "middleName": "",
            "lastName": "Boyd",
            "fullName": "Amanda Boyd",
            "collegeEmail": "amanda.boyd67@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8828299460728096",
            "rollNo": "ROLL068",
            "dob": "2006-12-30",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "306913159760",
            "mobileNumber": "+1-774-560-6012x729",
            "personalEmail": "stevensonaaron@example.com",
            "dept": "IT",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 2,
            "ugCgpa": 9.76,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 73.67,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 92.41,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Jonathanview",
                "state": "Iowa"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Robert",
            "middleName": "",
            "lastName": "Washington",
            "fullName": "Robert Washington",
            "collegeEmail": "robert.washington68@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "7149674695006326",
            "rollNo": "ROLL069",
            "dob": "2005-04-05",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "403128696501",
            "mobileNumber": "306-759-5594x32682",
            "personalEmail": "smithchristine@example.org",
            "dept": "IT",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 3,
            "ugCgpa": 6.57,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 69.94,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 71.8,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "North Jamesmouth",
                "state": "Montana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Kevin",
            "middleName": "",
            "lastName": "Young",
            "fullName": "Kevin Young",
            "collegeEmail": "kevin.young69@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "5547419720568483",
            "rollNo": "ROLL070",
            "dob": "2002-10-14",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "875783760283",
            "mobileNumber": "+1-836-495-6870x824",
            "personalEmail": "ywilliams@example.org",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 3,
            "currentArrears": 2,
            "ugCgpa": 6.71,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 91.16,
                    "board": "others",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 93.92,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Kristenstad",
                "state": "Pennsylvania"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Christopher",
            "middleName": "",
            "lastName": "Davis",
            "fullName": "Christopher Davis",
            "collegeEmail": "christopher.davis70@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "2629790915932771",
            "rollNo": "ROLL071",
            "dob": "2002-05-17",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "292251845039",
            "mobileNumber": "578-927-0645x8232",
            "personalEmail": "matthewstewart@example.com",
            "dept": "IT",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 8.18,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 91.08,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 84.03,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Tiffanyborough",
                "state": "Alaska"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "David",
            "middleName": "",
            "lastName": "Ryan",
            "fullName": "David Ryan",
            "collegeEmail": "david.ryan71@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9836759700506672",
            "rollNo": "ROLL072",
            "dob": "2004-12-17",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "872894524450",
            "mobileNumber": "999-638-8650x6178",
            "personalEmail": "jessica26@example.org",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 3,
            "ugCgpa": 7.1,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 85.95,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 89.63,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Masonburgh",
                "state": "Oregon"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Sabrina",
            "middleName": "Jeanette",
            "lastName": "Rose",
            "fullName": "Sabrina Jeanette Rose",
            "collegeEmail": "sabrina.rose72@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "3115768866981990",
            "rollNo": "ROLL073",
            "dob": "2004-08-14",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "377865303646",
            "mobileNumber": "001-608-461-9158x5509",
            "personalEmail": "kirksarah@example.org",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 2,
            "ugCgpa": 9.47,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 62.87,
                    "board": "CBSE",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 73.62,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "C1"
                }
            },
            "address": {
                "city": "New Alanview",
                "state": "Vermont"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Stephen",
            "middleName": "Savannah",
            "lastName": "Moore",
            "fullName": "Stephen Savannah Moore",
            "collegeEmail": "stephen.moore73@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "3891279413521750",
            "rollNo": "ROLL074",
            "dob": "2003-12-18",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "289400288227",
            "mobileNumber": "633-463-0110x87020",
            "personalEmail": "vanceamanda@example.net",
            "dept": "EEE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 2,
            "currentArrears": 3,
            "ugCgpa": 7.63,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 85.17,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 73.42,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "New Jeffreyton",
                "state": "Mississippi"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Michael",
            "middleName": "Nicholas",
            "lastName": "Mccoy",
            "fullName": "Michael Nicholas Mccoy",
            "collegeEmail": "michael.mccoy74@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4202629609548331",
            "rollNo": "ROLL075",
            "dob": "2002-09-02",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "179277690827",
            "mobileNumber": "001-351-432-8030",
            "personalEmail": "jermaine56@example.org",
            "dept": "EEE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 7.02,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 99.62,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 94.83,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "East Robertville",
                "state": "South Carolina"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Lucas",
            "middleName": "Brian",
            "lastName": "Meyers",
            "fullName": "Lucas Brian Meyers",
            "collegeEmail": "lucas.meyers75@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9161658035711216",
            "rollNo": "ROLL076",
            "dob": "2005-08-02",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "895024727101",
            "mobileNumber": "(954)247-8499x3036",
            "personalEmail": "heatherwaters@example.com",
            "dept": "EEE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 0,
            "currentArrears": 1,
            "ugCgpa": 6.45,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 86.92,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 84.33,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": false,
                    "level": "C2"
                }
            },
            "address": {
                "city": "New Jacquelineview",
                "state": "Colorado"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Mark",
            "middleName": "Scott",
            "lastName": "Phillips",
            "fullName": "Mark Scott Phillips",
            "collegeEmail": "mark.phillips76@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4417208843147343",
            "rollNo": "ROLL077",
            "dob": "2004-06-05",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "328536828983",
            "mobileNumber": "817.500.1961x851",
            "personalEmail": "egonzalez@example.com",
            "dept": "CSE",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 4,
            "currentArrears": 3,
            "ugCgpa": 7.15,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 91.79,
                    "board": "ICSC",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 76.37,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Warrenland",
                "state": "Texas"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Emily",
            "middleName": "",
            "lastName": "Weeks",
            "fullName": "Emily Weeks",
            "collegeEmail": "emily.weeks77@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "5812901061999023",
            "rollNo": "ROLL078",
            "dob": "2007-08-09",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "873042161834",
            "mobileNumber": "3805528335",
            "personalEmail": "gjones@example.com",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 3,
            "currentArrears": 0,
            "ugCgpa": 7.38,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 80.6,
                    "board": "others",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 83.53,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "East Latashamouth",
                "state": "Hawaii"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Brian",
            "middleName": "",
            "lastName": "Briggs",
            "fullName": "Brian Briggs",
            "collegeEmail": "brian.briggs78@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "4919642077323072",
            "rollNo": "ROLL079",
            "dob": "2007-06-08",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "526512350074",
            "mobileNumber": "(302)506-1354x9928",
            "personalEmail": "millervictoria@example.com",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 2,
            "currentArrears": 0,
            "ugCgpa": 5.51,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 71.16,
                    "board": "NEB",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 90.54,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Angelafort",
                "state": "Maryland"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Brian",
            "middleName": "",
            "lastName": "Hudson",
            "fullName": "Brian Hudson",
            "collegeEmail": "brian.hudson79@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9117740493745750",
            "rollNo": "ROLL080",
            "dob": "2006-01-17",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "527766036910",
            "mobileNumber": "4538117562",
            "personalEmail": "brewercindy@example.com",
            "dept": "CIVIL",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 1,
            "currentArrears": 2,
            "ugCgpa": 5.09,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 82.08,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 86.21,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Port Brenda",
                "state": "Arizona"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "George",
            "middleName": "Mario",
            "lastName": "Alexander",
            "fullName": "George Mario Alexander",
            "collegeEmail": "george.alexander80@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8897907020531095",
            "rollNo": "ROLL081",
            "dob": "2002-12-22",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "135818418251",
            "mobileNumber": "(282)539-6272x2506",
            "personalEmail": "qmoore@example.net",
            "dept": "CSE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 4,
            "currentArrears": 1,
            "ugCgpa": 5.05,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 98.32,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 64.05,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "A1"
                }
            },
            "address": {
                "city": "Michaelfort",
                "state": "Delaware"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Gabriela",
            "middleName": "Mitchell",
            "lastName": "Dawson",
            "fullName": "Gabriela Mitchell Dawson",
            "collegeEmail": "gabriela.dawson81@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "6301095313767655",
            "rollNo": "ROLL082",
            "dob": "2002-05-30",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "806947430585",
            "mobileNumber": "7682585476",
            "personalEmail": "miguel99@example.com",
            "dept": "CSE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 5,
            "currentArrears": 3,
            "ugCgpa": 9.37,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 74.9,
                    "board": "others",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 81.57,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Nicolestad",
                "state": "Vermont"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Thomas",
            "middleName": "Donna",
            "lastName": "Coleman",
            "fullName": "Thomas Donna Coleman",
            "collegeEmail": "thomas.coleman82@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "5750215915222750",
            "rollNo": "ROLL083",
            "dob": "2004-03-20",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "335071455596",
            "mobileNumber": "(981)895-3063",
            "personalEmail": "davislisa@example.net",
            "dept": "Cyber Security",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 1,
            "currentArrears": 0,
            "ugCgpa": 8.61,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 61.6,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 71.76,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "South Joseph",
                "state": "Michigan"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Shawn",
            "middleName": "",
            "lastName": "Smith",
            "fullName": "Shawn Smith",
            "collegeEmail": "shawn.smith83@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2630742094932527",
            "rollNo": "ROLL084",
            "dob": "2004-05-22",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "338518240154",
            "mobileNumber": "+1-942-577-8339",
            "personalEmail": "cindy43@example.com",
            "dept": "BME",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 4,
            "currentArrears": 2,
            "ugCgpa": 5.37,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 69.73,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 60.63,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "B2"
                }
            },
            "address": {
                "city": "East Brenda",
                "state": "Virginia"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jacob",
            "middleName": "Cody",
            "lastName": "Collins",
            "fullName": "Jacob Cody Collins",
            "collegeEmail": "jacob.collins84@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "8003660061231208",
            "rollNo": "ROLL085",
            "dob": "2006-01-31",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "613070212048",
            "mobileNumber": "887-388-7561x85546",
            "personalEmail": "kathy22@example.org",
            "dept": "AIDS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 5,
            "currentArrears": 3,
            "ugCgpa": 9.58,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 93.88,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 72.62,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Rachelville",
                "state": "Indiana"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "William",
            "middleName": "",
            "lastName": "Huber",
            "fullName": "William Huber",
            "collegeEmail": "william.huber85@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "8068345555644628",
            "rollNo": "ROLL086",
            "dob": "2006-09-04",
            "gender": "Female",
            "nationality": "Indian",
            "aadharNumber": "350832385473",
            "mobileNumber": "(700)458-1504",
            "personalEmail": "fordwayne@example.com",
            "dept": "BME",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 0,
            "currentArrears": 1,
            "ugCgpa": 9.17,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 90.63,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 61.43,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "B2"
                }
            },
            "address": {
                "city": "Port Megan",
                "state": "Alaska"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Christopher",
            "middleName": "",
            "lastName": "Larsen",
            "fullName": "Christopher Larsen",
            "collegeEmail": "christopher.larsen86@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "8547147410052035",
            "rollNo": "ROLL087",
            "dob": "2004-06-23",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "393738326717",
            "mobileNumber": "924-735-4135x9505",
            "personalEmail": "alexandra09@example.com",
            "dept": "AIML",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 5,
            "currentArrears": 0,
            "ugCgpa": 5.47,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 91.94,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 96.64,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Longberg",
                "state": "Delaware"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "John",
            "middleName": "Brianna",
            "lastName": "Malone",
            "fullName": "John Brianna Malone",
            "collegeEmail": "john.malone87@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "6376419782049080",
            "rollNo": "ROLL088",
            "dob": "2005-01-16",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "904813053697",
            "mobileNumber": "286-436-2407",
            "personalEmail": "angelicadavis@example.net",
            "dept": "CSE",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 1,
            "currentArrears": 3,
            "ugCgpa": 6.18,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 72.29,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 67.41,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Port Williamfort",
                "state": "Massachusetts"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Sabrina",
            "middleName": "Paul",
            "lastName": "Brady",
            "fullName": "Sabrina Paul Brady",
            "collegeEmail": "sabrina.brady88@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "6576049577272768",
            "rollNo": "ROLL089",
            "dob": "2006-01-03",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "893062518816",
            "mobileNumber": "790.464.1802",
            "personalEmail": "wruiz@example.org",
            "dept": "CHEM",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 5,
            "currentArrears": 3,
            "ugCgpa": 9.89,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 92.66,
                    "board": "State",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 61.22,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "East Tiffanyton",
                "state": "Alabama"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Megan",
            "middleName": "Kevin",
            "lastName": "Sanchez",
            "fullName": "Megan Kevin Sanchez",
            "collegeEmail": "megan.sanchez89@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "1875622622125437",
            "rollNo": "ROLL090",
            "dob": "2005-11-23",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "633532236521",
            "mobileNumber": "(717)919-6737x141",
            "personalEmail": "theresasmith@example.com",
            "dept": "CHEM",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 0,
            "currentArrears": 1,
            "ugCgpa": 6.63,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 79.05,
                    "board": "CBSE",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 85.53,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "Not Applicable"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Ramosberg",
                "state": "Maine"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Alan",
            "middleName": "Joseph",
            "lastName": "Leonard",
            "fullName": "Alan Joseph Leonard",
            "collegeEmail": "alan.leonard90@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "1133399390664307",
            "rollNo": "ROLL091",
            "dob": "2006-09-30",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "679202821950",
            "mobileNumber": "001-742-596-4172",
            "personalEmail": "alexandermatthews@example.com",
            "dept": "BME",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 1,
            "ugCgpa": 5.82,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 60.68,
                    "board": "State",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 65.09,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "Not Applicable"
                }
            },
            "address": {
                "city": "Thorntonfurt",
                "state": "Delaware"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Mitchell",
            "middleName": "",
            "lastName": "Hood",
            "fullName": "Mitchell Hood",
            "collegeEmail": "mitchell.hood91@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "1535694964604573",
            "rollNo": "ROLL092",
            "dob": "2003-02-06",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "675118440962",
            "mobileNumber": "249-965-0383",
            "personalEmail": "savagekevin@example.net",
            "dept": "BME",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2026,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 7.01,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 93.78,
                    "board": "CBSE",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 62.1,
                    "passingYear": 2022
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Barreramouth",
                "state": "Nebraska"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Megan",
            "middleName": "",
            "lastName": "Woods",
            "fullName": "Megan Woods",
            "collegeEmail": "megan.woods92@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "9223662258442599",
            "rollNo": "ROLL093",
            "dob": "2005-04-18",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "106396758938",
            "mobileNumber": "228-952-5839",
            "personalEmail": "michaelwilliams@example.org",
            "dept": "AIDS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 5,
            "currentArrears": 1,
            "ugCgpa": 6.32,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 79.26,
                    "board": "others",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 91.27,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N3"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "Smithtown",
                "state": "Texas"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Gabriela",
            "middleName": "",
            "lastName": "Bradford",
            "fullName": "Gabriela Bradford",
            "collegeEmail": "gabriela.bradford93@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "7899185286368779",
            "rollNo": "ROLL094",
            "dob": "2007-05-23",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "685644322806",
            "mobileNumber": "(262)222-8835x348",
            "personalEmail": "kimberly09@example.net",
            "dept": "Mechatronics",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2025,
            "historyOfArrears": 5,
            "currentArrears": 3,
            "ugCgpa": 6.03,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 83.18,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 62.14,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N5"
                },
                "german": {
                    "knows": false,
                    "level": "C2"
                }
            },
            "address": {
                "city": "Lake Micheleberg",
                "state": "Wyoming"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Andre",
            "middleName": "",
            "lastName": "Montgomery",
            "fullName": "Andre Montgomery",
            "collegeEmail": "andre.montgomery94@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4331233204888447",
            "rollNo": "ROLL095",
            "dob": "2005-06-29",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "365331327128",
            "mobileNumber": "+1-771-929-5220x42069",
            "personalEmail": "lindatownsend@example.com",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2024,
            "historyOfArrears": 0,
            "currentArrears": 3,
            "ugCgpa": 7.55,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 70.12,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 77.08,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N4"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "South Samuelburgh",
                "state": "Alabama"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Jennifer",
            "middleName": "Bonnie",
            "lastName": "Green",
            "fullName": "Jennifer Bonnie Green",
            "collegeEmail": "jennifer.green95@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "1507487351851674",
            "rollNo": "ROLL096",
            "dob": "2002-07-19",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "672738455211",
            "mobileNumber": "735-522-3206",
            "personalEmail": "pray@example.com",
            "dept": "AIDS",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 3,
            "currentArrears": 1,
            "ugCgpa": 5.44,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 60.34,
                    "board": "ICSC",
                    "passingYear": 2018
                },
                "twelth": {
                    "percentage": 95.95,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "A1"
                }
            },
            "address": {
                "city": "East Annaton",
                "state": "Arizona"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Carrie",
            "middleName": "",
            "lastName": "Scott",
            "fullName": "Carrie Scott",
            "collegeEmail": "carrie.scott96@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "2332433599081465",
            "rollNo": "ROLL097",
            "dob": "2002-08-27",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "511940961221",
            "mobileNumber": "+1-276-885-4873",
            "personalEmail": "vwalsh@example.net",
            "dept": "AIDS",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2024,
            "historyOfArrears": 4,
            "currentArrears": 0,
            "ugCgpa": 7.55,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 68.41,
                    "board": "NEB",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 72.77,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N1"
                },
                "german": {
                    "knows": false,
                    "level": "B1"
                }
            },
            "address": {
                "city": "North Joshuaville",
                "state": "Vermont"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Thomas",
            "middleName": "",
            "lastName": "Wallace",
            "fullName": "Thomas Wallace",
            "collegeEmail": "thomas.wallace97@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": false,
            "universityRegNumber": "2124688135632991",
            "rollNo": "ROLL098",
            "dob": "2002-03-03",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "526633548248",
            "mobileNumber": "(243)521-0906",
            "personalEmail": "garyblackwell@example.org",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 2,
            "currentArrears": 2,
            "ugCgpa": 7.65,
            "residence": "Day Scholar",
            "education": {
                "tenth": {
                    "percentage": 67.91,
                    "board": "State",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 65.73,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N2"
                },
                "german": {
                    "knows": true,
                    "level": "C1"
                }
            },
            "address": {
                "city": "Port Michaelland",
                "state": "Oregon"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Cynthia",
            "middleName": "",
            "lastName": "Collins",
            "fullName": "Cynthia Collins",
            "collegeEmail": "cynthia.collins98@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "9179937415040309",
            "rollNo": "ROLL099",
            "dob": "2003-10-31",
            "gender": "Male",
            "nationality": "Indian",
            "aadharNumber": "854151155711",
            "mobileNumber": "001-586-419-4129x7763",
            "personalEmail": "mary40@example.org",
            "dept": "IT",
            "quota": "Government Quota(GQ)",
            "passoutYear": 2025,
            "historyOfArrears": 5,
            "currentArrears": 2,
            "ugCgpa": 9.83,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 65.59,
                    "board": "ICSC",
                    "passingYear": 2020
                },
                "twelth": {
                    "percentage": 89.69,
                    "passingYear": 2020
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": true,
                    "level": "N1"
                },
                "german": {
                    "knows": true,
                    "level": "B1"
                }
            },
            "address": {
                "city": "North Theresa",
                "state": "Mississippi"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        },
        {
            "firstName": "Bradley",
            "middleName": "",
            "lastName": "Williams",
            "fullName": "Bradley Williams",
            "collegeEmail": "bradley.williams99@kpriet.ac.in",
            "password": "password123",
            "role": "student",
            "isProfileComplete": true,
            "universityRegNumber": "4065141679519934",
            "rollNo": "ROLL100",
            "dob": "2003-11-10",
            "gender": "Other",
            "nationality": "Indian",
            "aadharNumber": "895638676152",
            "mobileNumber": "717.827.4380",
            "personalEmail": "iburns@example.org",
            "dept": "CHEM",
            "quota": "Management Quota(MQ)",
            "passoutYear": 2026,
            "historyOfArrears": 0,
            "currentArrears": 2,
            "ugCgpa": 5.19,
            "residence": "Hostel",
            "education": {
                "tenth": {
                    "percentage": 89.54,
                    "board": "ICSC",
                    "passingYear": 2019
                },
                "twelth": {
                    "percentage": 90.29,
                    "passingYear": 2021
                },
                "diploma": {
                    "percentage": null,
                    "passingYear": null
                }
            },
            "languages": {
                "japanese": {
                    "knows": false,
                    "level": "N2"
                },
                "german": {
                    "knows": false,
                    "level": "A2"
                }
            },
            "address": {
                "city": "Josephbury",
                "state": "North Dakota"
            },
            "photoUrl": "",
            "resumeUrl": "",
            "codingProfiles": {
                "leetcode": "",
                "codeforces": "",
                "hackerrank": "",
                "geeksforgeeks": "",
                "github": ""
            }
        }
];

module.exports = {
  testStudents
};
