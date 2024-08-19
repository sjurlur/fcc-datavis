#!/bin/bash

PSQL="psql -X --username=freecodecamp --dbname=periodic_table --tuples-only -c"

# if argument
if [[ $1 ]]
then
  # if numeric
  # can not set int to string
  if [[ $1 =~ ^[0-9]+$ ]]
  then
    WHERE="atomic_number='$1'"
  # if not numeric
  else
    WHERE="symbol='$1' OR name='$1'"
  fi

  RESULT=$($PSQL "SELECT atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, type FROM elements LEFT JOIN properties USING(atomic_number) left join types USING(type_id) WHERE $WHERE")

  # if empty
  if [[ -z $RESULT ]]
  then
    echo "I could not find that element in the database."
  else
    echo "$RESULT" | while read ATOMIC_NUMBER PIPE SYMBOL PIPE NAME PIPE MASS PIPE MELTING_POINT PIPE BOILING_POINT PIPE TYPE
    do
      echo "The element with atomic number $ATOMIC_NUMBER is $NAME ($SYMBOL). It's a nonmetal, with a mass of $MASS amu. $NAME has a melting point of $MELTING_POINT celsius and a boiling point of $BOILING_POINT celsius."
    done
  fi
  
# if no input argument
else
  echo -e "Please provide an element as an argument."
fi
