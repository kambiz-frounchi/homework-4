# Code Quiz

 This app is a timed code quiz with multiple-choice questions. It will run in the browser and feature dynamically updated HTML and CSS powered by your JavaScript code. It will also feature a clean and polished user interface and be responsive, ensuring that it adapts to multiple screen sizes.

 I haven't used any jQuery. Most of the styling is through bootstap, otherwise used vanilla Javascript to deal with the DOM elements. I have also used local storage to save the high scorers. At the start of the program, the high scrorers are retrieved from local storage and populated in the quiz object.

 A more exact high level definition of the program is described below in the User Story and Acceptance Criteria (requirements) sections.

 The URL of the app is: https://kambiz-frounchi.github.io/homework-4/.

 Please check out a few screenshots of the app in these images: quiz1.jpg, quiz2.jpg, quiz3.jpg and quiz4.jpg.



## User Story

```
AS A coding bootcamp student
I WANT to take a timed quiz on JavaScript fundamentals that stores high scores
SO THAT I can gauge my progress compared to my peers
```

## Acceptance Criteria

```
GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question
WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and score
```



