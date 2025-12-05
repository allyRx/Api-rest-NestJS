module.exports={
    type:'postgres',
    host:'localhost',
    port:5432,
    username:'postgres',
    password:'password',
    database:'nestcoffee',
    entities:['dist/**/*.entity{.ts,.js}'],
    migrations:['dist/migration/*{.ts,.js}'],
    synchronize:true,
    cli:{
        migrationsDir:'src/migrations',
    },


}