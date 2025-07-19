import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { RoleService } from "src/roles/role.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Role } from "src/roles/entities/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role])],
    controllers: [UserController],
    providers:[UserService,RoleService],
    exports: [UserService, TypeOrmModule]
})

export class UserModule{}