insert into users(name, email, password)
values(${name}, ${email}, ${password});

select id, name, email
from users
where email = ${email};

-- when done like this we must pass in an object on createUserResponse from auth controller await