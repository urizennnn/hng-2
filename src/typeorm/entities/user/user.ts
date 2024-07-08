import { Organization } from '../Organisation/org';
import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable } from 'typeorm';

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

	@ManyToMany(() => Organization, organization => organization.users)
	@JoinTable({
		name: 'user_organizations_organization',
		joinColumn: { name: 'userId', referencedColumnName: 'userId' },
		inverseJoinColumn: { name: 'orgId', referencedColumnName: 'orgId' },
	})
	organizations: Organization[];
}

