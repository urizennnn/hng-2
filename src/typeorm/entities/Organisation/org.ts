import { User } from '@entity/user/user';
import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';

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
	@JoinTable()
	users: User[];
}