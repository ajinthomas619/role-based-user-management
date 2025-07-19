import { Company } from "src/companies/entities/company.entity";
import { Role } from "src/roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

@Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;


  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_deleted: boolean;


  @Column()
  role_id: number;

  @Column()
  company_id: number;

  @Column({ nullable: true })
  created_by: number;


  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Company, company => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}