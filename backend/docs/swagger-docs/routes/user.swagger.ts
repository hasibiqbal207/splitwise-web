/* 
    Represents the Swagger documentation for the User routes 
    in the form of ./backend/src/routes/user.route.ts
*/

//              ### View an user profile

/**
 * @openapi
 * /user/userProfile:
 *   post:
 *     summary: Get an user profile data by email.
 *     description: Get an user profile data by email.
 *     tags:
 *       - User API's
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
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Success
 *                  description: Status of the password update operation.
 *                message:
 *                  type: string
 *                  example: User fetched successfully
 *                  description: Message describing the fetching of the user data.
 *                user:
 *                  allof:
 *                    - $ref: '#/components/schemas/User'
 *                    - type: object
 *                      properties:
 *                        password:
 *                          type: string
 *                          readOnly: true
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

//              ### Update an user profile

/**
 * @openapi
 * /user/userProfile:
 *   put:
 *     summary: Update an user profile data. Initially, only the names.
 *     description: Update an user profile data. Initially, only the names.
 *     tags:
 *       - User API's
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
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Success
 *                  description: Status of the password update operation.
 *                message:
 *                  type: string
 *                  example: User updated Successfully
 *                  description: Message describing the fetching of the user data.
 *                response:
 *                  allof:
 *                    - $ref: '#/components/schemas/User'
 *                    - type: object
 *                      properties:
 *                        password:
 *                          type: string
 *                          readOnly: true
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

//              ### Delete an user profile

/**
 * @openapi
 * /user/deleteUser:
 *   delete:
 *     summary: Delete an user profile data by email.
 *     description: Delete an user profile data by email.
 *     tags:
 *       - User API's
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
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile data.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Success
 *                  description: Status of the password update operation.
 *                message:
 *                  type: string
 *                  example: User Account deleted!
 *                  description: Message describing the fetching of the user data.
 *                response:
 *                  type: object
 *                  properties:
 *                    acknowledged:
 *                      type: boolean
 *                      example: true
 *                      description: Indicates whether the operation was acknowledged by the server.
 *                    deletedCount:
 *                      type: integer
 *                      example: 1
 *                      description: Number of documents deleted.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

//              ### Get All User Names and Emails

/**
 * @openapi
 * /user/users:
 *   get:
 *     summary: Get All User Names and Emails.
 *     description: Get All User Names and Emails.
 *     tags:
 *       - User API's
 *     responses:
 *       200:
 *         description: Successfully retrieved list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                   description: Status of the operation.
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Hasib Iqbal
 *                         description: Name of the user.
 *                       email:
 *                         type: string
 *                         example: test@gmail.com
 *                         description: Email address of the user.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
