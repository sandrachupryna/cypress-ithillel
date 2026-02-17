# Garage & Fuel Expenses – Test Coverage

> **Legend**

* ❗ **Smoke / Critical path**
* 🔴 **P0 – Must be automated first**
* 🟠 **P1 – Should be automated**
* ⚪ **P2 – Nice to have / manual initially**

---

## 1. Garage tab
### 1.1 Garage tab – UI & Empty State

#### GARAGE-UI-01 🔴 

**Verify:**

* Garage tab is available after login
* Tab title is displayed correctly
* `Add car` button is visible and enabled

#### GARAGE-EMPTY-01 🔴 ❗

**Precondition:** No cars in garage

**Verify:**

* Message `You don’t have any cars in your garage` is displayed
* Car list is not displayed
* `Add car` button is available

---
### 1.2. Add Car
#### 1.2.1 Add Car Modal – Open / Close

#### ADD-CAR-MODAL-01 🔴

**Verify:**

* Modal opens on `Add car`
* Fields are present:

  * brand (dropdown)
  * model (dropdown)
  * mileage
* Buttons: Add, Cancel, Close (✕)

#### ADD-CAR-MODAL-02 🟠

**Verify:**

* Cancel closes modal
* No data is saved

#### ADD-CAR-MODAL-03 🟠

**Verify:**

* Close (✕) closes modal
* No data is saved

---

#### 1.2.2. Brand / Model Dropdown Logic

#### ADD-CAR-BRAND-01 🔴

**Verify:**

* Brand dropdown contains only:

  * Audi, BMW, Ford, Fiat, Porsche
* Free text input is not allowed

#### ADD-CAR-MODEL-01 🔴

**Verify:**

* Model dropdown is disabled until brand selected
* Model list depends on selected brand

#### ADD-CAR-MODEL-02 🟠

**Verify:**

* Changing brand resets model field
* New model list is loaded

---

#### 1.2.3 Mileage Validation (Add Car)

#### ADD-CAR-MILEAGE-01 🔴

**Verify valid values:**

* 0
* 1
* 999999

#### ADD-CAR-MILEAGE-02 🔴

**Verify invalid values:**

* < 0
* > 999999

**Expected:**

* Error `Mileage has to be from 0 to 999999`
* Add button disabled

#### ADD-CAR-MILEAGE-03 🟠

**Verify:**

* Empty mileage field is invalid

#### ADD-CAR-MILEAGE-04 ⚪

**Verify:**

* Letters / special symbols / decimals are not accepted

---

#### 1.2.4. Add Car – Creation

#### ADD-CAR-SUBMIT-01 🔴 ❗

**Verify:**

* Car is added successfully
* Modal closes
* Car card appears in Garage

#### ADD-CAR-SUBMIT-02 🟠

**Verify:**

* Add button enabled only when all fields are valid

---

### 1.3. Garage – Car Card

#### GARAGE-CARD-01 🔴 ❗

**Verify:**

* Brand + model displayed
* Mileage displayed
* Update mileage date displayed
* Buttons: Edit car, Add fuel expense

#### GARAGE-CARD-02 🟠

**Verify:**

* Multiple cars are displayed correctly

---

### 1.4. Update Mileage

#### UPDATE-MILEAGE-01 🔴

**Verify:**

* Mileage can be increased
* Update button activates
* Update date is refreshed

#### UPDATE-MILEAGE-02 🔴

**Verify:**

* Mileage cannot be decreased

#### UPDATE-MILEAGE-03 🟠

**Verify:**

* Same mileage value does not activate Update

---

### 1.5. Add Fuel Expense – From Garage

#### ADD-EXPENSE-GARAGE-01 🔴

**Verify:**

* Add expense modal opens from Garage
* Vehicle dropdown contains garage cars

#### ADD-EXPENSE-GARAGE-02 🔴

**Verify validations:**

* Report date >= car created date
* Mileage >= car mileage
* Liters: 0.01–9999
* Total cost: 0.01–1000000

#### ADD-EXPENSE-GARAGE-03 🔴 ❗

**Verify:**

* Expense is added successfully
* Appears in Fuel expenses tab

---

### 1.6. Edit Car Modal

#### EDIT-CAR-MODAL-01 🔴

**Verify:**

* Modal opens with prefilled data

#### EDIT-CAR-MILEAGE-01 🔴

**Verify:**

* Mileage cannot be decreased

#### EDIT-CAR-DATE-01 🟠

**Verify:**

* Created at date can be set earlier

#### EDIT-CAR-SAVE-01 🔴

**Verify:**

* Changes are saved
* Modal closes

---

### 1.7. Delete Car Flow

#### DELETE-CAR-CONFIRM-01 🔴

**Verify:**

* Confirmation modal appears

#### DELETE-CAR-CANCEL-01 🟠

**Verify:**

* Cancel does not delete car

#### DELETE-CAR-REMOVE-01 🔴 ❗

**Verify:**

* Car removed from Garage
* Related expenses removed
* Car not present in Fuel expenses dropdown

---
## 2. Fuel Expenses Tab
### 2.1. Fuel Expenses Tab – Empty States

#### FUEL-TAB-EMPTY-01 🔴

**Verify:**

* No cars → dropdown hidden
* Message `You don’t have any cars in your garage`

#### FUEL-TAB-EMPTY-02 🔴 

**Verify:**

* Cars exist, no expenses → message `You don’t have any fuel expenses filed in`

---

### 2.2. Fuel Expenses – Add Expense from Tab

#### FUEL-TAB-ADD-01 🔴

**Verify:**

* `Add an expense` button is visible
* Modal opens correctly

#### FUEL-TAB-ADD-02 🔴

**Verify:**

* Vehicle dropdown lists all garage cars

#### FUEL-TAB-ADD-03 🔴

**Verify:**

* Same validations as Garage Add Expense

#### FUEL-TAB-ADD-04 🔴

**Verify:**

* Expense appears in table for selected car

#### FUEL-TAB-ADD-05 🟠

**Verify:**

* Cancel / Close does not add expense

---

### 2.3. Fuel Expenses – Table

#### FUEL-TAB-TABLE-01 🔴 

**Verify columns:**

* date
* mileage
* liters used
* total cost

#### FUEL-TAB-TABLE-02 🔴 ❗

**Verify:**

* Table values match added expense

---


## 3. Cross-Feature Scenarios

#### CROSS-01 🔴 ❗

**Verify:**

* Expense added from Garage visible in Fuel expenses

#### CROSS-02 🔴

**Verify:**

* Expense added from Fuel expenses linked to correct car
* Mileage is updated

#### CROSS-03 🔴

**Verify:**

* Deleting car removes expenses added from both entry points

