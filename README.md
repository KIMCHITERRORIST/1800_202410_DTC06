# Project Title

## 1. Project Description

FitQuest is a comprehensive weight management app designed to seamlessly integrate diet tracking, activity monitoring, goal setting, and sophisticated data visualization, enabling effortless logging and management of health goals.

## 2. Names of Contributors
List team members and/or short bio's here... 

* Hi, my name is Nolan. I'm excited to see what will happen to us and what we will be creating together in the future!!
* Hi I am Matt, I like dogs and golf
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

* HTML, CSS, JavaScript
* Tailwind 3.4.3
* Tailwind UI for some custom made UI components 
* Flowbite for template and graph format
* Apex Charts 3.48 + docs docs
* https://tailwindflex.com/@lukas-muller/modal-popup for modal design insppiration and code 
* FireBase 10.11.0 + docs
* w3schools.com for tutorials and basic syntax 
* chatgpt.com for styling and basic debugging. Not a very good coder.  
* For figuring out calculationg with TDEE And BMI/BMR
    - https://tdeecalculator.net/
    - https://www.acko.com/calculators/tdee-calculator/
    - https://www.calculator.net/bmr-calculator.html
    - https://www.calculator.net/bmi-calculator.html
* ICONS
    - https://inkscape.org/
    - https://tablericons.com/
    - 

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...

* please make an account using the sign up page
* after making ur account log in and then fill in your personal information
* you will then be sent to the overview/homepage where you can start food entries or logging your calories
* The hamburger icon on the top right will lead you to all the main pages.
* There will be a main add button in the center of the bottom nav bar. Please use this to create  new entries
* The overview/homepage will only show you 


## 5. Known Bugs and Limitations
Here are some known bugs:

* our page names are a little confusing. refactoring our code was proving to be difficult and we did not have time to completely make it bug free so we kept it as is. 
* graph doesnt display numbers on page load. must be clicked first to view the values
* Names of recipes and categories cannot be changed due to their names being their collection id within firebase. this is a limitation within firebase to not allow collection id/names be changed and we did not know that untill it was too late.
* some pages will sometimes load the modal by accident.
* 

## 6. Features for Future
What we'd like to build in the future:

* More compatability for people looking to gain wieght. Had to focus on weight loss for the Goal calories reduction logic.
* add more style to overall app. we did not use any fonts and could use graphics for the macros on the individual recipe pages. 
* support pages, lost password pages, contact page. 
* social aspect where you and your friends can see your achievements and "duel eachother for a week to see who is more consistent"
* "quest/achievement log" where if you do a positive thing it will come up as an entry. ex completed work out and a thumbs up icon, or completed todays calorie quest and date with a thumbs up
* connecting with API like the food library API from USDA and figuring out how to connect with smart watches (daunting task from first glance)
* better organization for food and exercise log.
* finish goal page and how it interacts with other pages 
* make a proper profile page


	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .firebaserc              # Config file for hosting firebase on server.
├── .gitignore               # Git ignore file.
├── 404.html                 # Default Error page.
├── add_exercise.html        # Page for logging your exercise.
├── addMeal.html             # Page containing modal to add meal. 
├── each_category.html       # Page to view recipes within categories.
├── each_recipe.html         # Page to view individual recipes.  
├── exercise_log.html        # page to view Log of all your exercises you have done.
├── forebase.json            # Confige files for firebase init. 
├── firestore.indexes.json   # landing HTML file, Our login Page.
├── firestore.rules          # Config files containing rules for interacting with firestore.
├── goals.html               # Page for viewing goals. unused for now.
├── index.html               # landing HTML file, Our login Page.
├── ingredients.html         # Page for viewing ingredient library.
├── meal_log.html            # Page to view all meals logged. 
├── my_categories.html       # Page to view recipe categories like breakfast. 
├── overview.html            # Main home page that acts as the daily overview page.
├── profile.html             # Page to view users basic data and edit them.
├── README.md                # our main README file to get a general overview of our project.
├── signup.html              # Page to first create and authorize an account in firebase.
├── template.html            # landing HTML file, Our login Page.
└── user_info.html           # Page for user to input info when they first make their account.

It has the following subfolders and files:
├── .firebase                   # Folder for images
    /blah.jpg                # Acknowledge source
├── images                   # Folder for images
    /cal_in icon.svg         # Acknowledge source
    /FitQuest Logo.svg                # Acknowledge source
    /kcal_icon.svg                # Acknowledge source
    /kcal_in.png                # Acknowledge source
├── main_modals                  # Folder for scripts
    /add_ingredients_modal.html                 # 
    /add_new_category_modal.html                # 
    /add_new_recipe_modal.html                 # 
    /quick_add_meal_modal.html                 # 
├── navbars                   # Folder for styles
    /general_nav_bottom.html                # 
    /general_nav_top.html                #
    /home_nav_bottom.html                #
    /home_nav_top.html                #
├── scripts                  # Folder for scripts
    /blah.js                 # 
```


