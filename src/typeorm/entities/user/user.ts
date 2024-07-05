import { Organization } from '@entity/Organisation/org';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany, JoinTable } from 'typeorm';

@Entity()
@Unique(['userId'])
@Unique(['email'])
export class User {
	@PrimaryGeneratedColumn('uuid')
	userId: string;

	@Column({ nullable: false })
	firstName: string;

	@Column({ nullable: false })
	lastName: string;

	@Column({ nullable: false, unique: true })
	email: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: true })
	phone?: string;

	@OneToMany(() => Organization, org => org.users)
	@JoinTable()
	organizations: Organization[];
}
