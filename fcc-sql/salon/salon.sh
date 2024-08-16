#!/bin/bash

PSQL="psql -X --username=freecodecamp --dbname=salon --tuples-only -c"

SERVICES=$($PSQL "SELECT service_id, name FROM services order by service_id")

MAIN_MENU() {
  echo -e "\n~~Welcome to the salon~~\n"

  SELECT_SERVICE
}

SELECT_SERVICE() {
  echo -e "What do you want?\n"
  echo "$SERVICES" | while read SERVICE_ID BAR NAME
  do
    echo "$SERVICE_ID) $NAME"
  done 

  read SERVICE_ID_SELECTED

  SERVICE_ID_SELECTED_RESPONSE=$($PSQL "SELECT * FROM services WHERE service_id=$SERVICE_ID_SELECTED")
  if [[ -z $SERVICE_ID_SELECTED_RESPONSE ]]
  then
    echo -e "\nService does not exist, select a new service"
    SELECT_SERVICE
  else
    ENTER_PHONE
    CREATE_APPOINTMENT
  fi
}

ENTER_PHONE() {
  echo -e "\nEnter phone number"
  read CUSTOMER_PHONE

  CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
  if [[ -z $CUSTOMER_ID ]]
  then
    CREATE_CUSTOMER
    CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE phone='$CUSTOMER_PHONE'")
  fi  
}

CREATE_CUSTOMER() {
  echo -e "\nEnter you name"
  read CUSTOMER_NAME
  CREATE_CUSTOMER_RESPONSE=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
}

CREATE_APPOINTMENT() {
  echo -e "\nWhen do you want the appointment?"
  read SERVICE_TIME
  CREATE_APPOINTMENT_RESPONSE=$($PSQL "INSERT INTO appointments(customer_id,service_id,time) values($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')")

  echo -e "\nI have put you down for a cut at $SERVICE_TIME, $CUSTOMER_NAME."
}

MAIN_MENU