/* 
    Represents the Swagger documentation for the authentication routes 
    in the form of ./backend/src/routes/authentication.route.ts
*/

//              ### Register an user

/**
 * @openapi
 * /auth/registerUser:
 *   post:
 *     summary: Register an user.
 *     description: Register a new user with email and password. Returns an userId.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name.
 *                 example: "Hasib"
 *               lastName:
 *                 type: string
 *                 description: User's last name.
 *                 example: "Iqbal"
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: "test@gmail.com"
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "TestPassword@123"
 *     responses:
 *       200:
 *         description: Successful Registration, returns success message & userId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "User Registration Successful"
 *                 userId:
 *                   type: string
 *                   example: "67019fbd5bacc7c300309b1d"
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

//              ### Login an user

/**
 * @openapi
 * /auth/loginUser:
 *   post:
 *     summary: Login an user
 *     description: Authenticate an user with email and password, and return a JWT token and user details.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: "test@gmail.com"
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "TestPassword@123"
 *     responses:
 *       200:
 *         description: Successful login, returns user information and access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 message:
 *                   type: string
 *                   example: "User Login Success"
 *                 userId:
 *                   type: string
 *                   example: "667b62c37cc329877c5929ef"
 *                 email:
 *                   type: string
 *                   example: "test@gmail.com"
 *                 firstName:
 *                   type: string
 *                   example: "Hasib"
 *                 lastName:
 *                   type: string
 *                   example: "Iqbal"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiJ9.dGVzdEBnbWFpbC5jb20.qffo9HSr1KAOPsNirYJWdiEh6xNIzE5gSHIWcGTU-Ao"
 *       400:
 *         description: Bad request, invalid email or password.
 *       500:
 *         description: Internal server error.
 */

//              ### Update password of an user. (Only for authenticated users)

/**
 * @openapi
 * components:
 *  schemas:
 *    PasswordUpdateResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          example: Success
 *          description: Status of the password update operation.
 *        message:
 *          type: string
 *          example: Password updated successfully
 *          description: Message describing the result of the password update.
 *        user:
 *          $ref: '#/components/schemas/User'
 *
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          example: 667d7bf8937dd0b603ac7495
 *          description: The unique identifier for the user, used it as userId.
 *        firstName:
 *          type: string
 *          example: Hasib
 *          description: The first name of the user.
 *        lastName:
 *          type: string
 *          example: Iqbal
 *          description: The last name of the user.
 *        email:
 *          type: string
 *          format: email
 *          example: test@gmail.com
 *          description: The email address of the user.
 *        password:
 *          type: string
 *          example: $2b$10$guyLB8ivrbO5cNC4mN/EyeEafMEiGSUjw2mnIbX97ZpKnRcvxEI4K
 *          description: The hashed password of the user.
 *        createdAt:
 *          type: string
 *          format: date-time
 *          example: 2024-06-27T14:49:28.415Z
 *          description: The timestamp when the user was created.
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          example: 2024-10-06T12:53:01.757Z
 *          description: The timestamp when the user's information was last updated.
 *        __v:
 *          type: integer
 *          example: 0
 *          description: The document version key.
 * 
 * 
 * /auth/updatePassword:
 *   post:
 *     summary: Update password of an user
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       description: The new password and user details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: "test@gmail.com"
 *               oldPassword:
 *                 type: string
 *                 description: User's password.
 *                 example: "TestPassword@123"
 *               newPassword:
 *                 type: string
 *                 description: User's password.
 *                 example: "TestPassword@2022"
 *     responses:
 *       200:
 *         description: Password updated successfully, returns user information containing id, name, email, password, createdAt, and updatedAt.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/PasswordUpdateResponse'
 *       400:
 *         description: Bad request, invalid email or password.
 *       500:
 *         description: Internal server error.
 */