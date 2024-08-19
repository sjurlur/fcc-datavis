#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=postgres -t --no-align -c"

READGUESS() {
  if [[ ! $GUESS =~ ^[0-9]+$ ]]
  then
   echo -e "\nThat is not an integer, guess again:" 
  else
    if [[ $GUESS < $NUMBER ]]
    then
      echo -e "\nIt's higher than that, guess again:"
    else
      echo -e "\nIt's lower than that, guess again:"
    fi
    NUMTRIES=$(($NUMTRIES+1))
  fi
  read GUESS
}

echo -e "Enter your username:"
read USERNAME

USER_ID=$($PSQL "SELECT user_id FROM users where name='$USERNAME'")
if [[ -z $USER_ID ]]
then
  echo -e "\nWelcome, $USERNAME! It looks like this is your first time here."
  INSERT_RESPONSE=$($PSQL "INSERT INTO users(name) VALUES('$USERNAME')")
  USER_ID=$($PSQL "SELECT user_ID FROM users where name='$USERNAME'")
else
  GAMES_PLAYED=$($PSQL "SELECT games_played from users where user_id=$USER_ID")
  BEST_GAME=$($PSQL "SELECT best_game from users where user_id=$USER_ID")
  echo -e "\nWelcome back, $USERNAME! You have played $GAMES_PLAYED games, and your best game took $BEST_GAME guesses."
fi

NUMBER=$(( RANDOM % 1000 ))
NUMTRIES=1

if [[ $1 -eq '--debug' ]]
then
  echo -e "Magic number: $NUMBER"
fi

echo -e "\nGuess the secret number between 1 and 1000:"
read GUESS 

while [[ $GUESS -ne $NUMBER ]]
do
  READGUESS
done

echo -e "\nYou guessed it in $NUMTRIES tries. The secret number was $NUMBER. Nice job!"

# insert into db
GAMES_PLAYED=$($PSQL "SELECT games_played FROM users WHERE user_id=$USER_ID")
GAMES_PLAYED=$(($GAMES_PLAYED+1))
BEST_GAME=$($PSQL "SELECT best_game FROM users WHERE user_id=$USER_ID")
if [[ -z $BEST_GAME ]]
then
  BEST_GAME=$NUMTRIES
else
  if [[ $NUMTRIES < $BEST_GAME ]]
  then
    BEST_GAME=$NUMTRIES
  fi
fi

INSERT_RESPONSE=$($PSQL "UPDATE users SET best_game=$BEST_GAME, games_played=$GAMES_PLAYED where user_id=$USER_ID")
