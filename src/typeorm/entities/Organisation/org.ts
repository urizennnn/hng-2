import { User } from '../user/user';
import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable, ManyToOne } from 'typeorm';

@Entity()
@Unique(['orgId'])
export class Organization {
	@PrimaryGeneratedColumn('uuid')
	orgId: string;

	@Column({ nullable: false })
	name: string;

	@Column({ nullable: true })
	description: string;

	@ManyToMany(() => User, user => user.organizations)
	users: User[];
}
