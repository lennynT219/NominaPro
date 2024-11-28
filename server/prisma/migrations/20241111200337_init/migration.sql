BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Area] (
    [id_area] INT NOT NULL IDENTITY(1,1),
    [nom_area] VARCHAR(100) NOT NULL,
    [descripcion] VARCHAR(150) NOT NULL,
    CONSTRAINT [Area_pkey] PRIMARY KEY CLUSTERED ([id_area])
);

-- CreateTable
CREATE TABLE [dbo].[CargoEmpleado] (
    [id_cargo_emp] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [id_cargo] INT NOT NULL,
    [fecha_inicio] VARCHAR(11) NOT NULL,
    [fecha_fin] VARCHAR(11),
    [sueldo] VARBINARY(max) NOT NULL,
    [tipo_contrato] VARBINARY(max) NOT NULL,
    [jornada] VARCHAR(10) NOT NULL,
    [estado_cargo] BIT NOT NULL CONSTRAINT [CargoEmpleado_estado_cargo_df] DEFAULT 1,
    CONSTRAINT [CargoEmpleado_pkey] PRIMARY KEY CLUSTERED ([id_cargo_emp]),
    CONSTRAINT [CargoEmpleado_ci_em_id_cargo_fecha_inicio_key] UNIQUE NONCLUSTERED ([ci_em],[id_cargo],[fecha_inicio])
);

-- CreateTable
CREATE TABLE [dbo].[Cargos] (
    [id_cargo] INT NOT NULL IDENTITY(1,1),
    [id_area] INT NOT NULL,
    [nom_cargo] VARCHAR(100) NOT NULL,
    [descripcion] VARCHAR(200) NOT NULL,
    CONSTRAINT [Cargos_pkey] PRIMARY KEY CLUSTERED ([id_cargo])
);

-- CreateTable
CREATE TABLE [dbo].[CargosFamiliares] (
    [id_cargo] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [nom_carga] VARCHAR(30) NOT NULL,
    [apel_cargo] VARCHAR(30) NOT NULL,
    [parentesco] VARCHAR(30) NOT NULL,
    [fecha_nace] VARCHAR(11) NOT NULL,
    CONSTRAINT [CargosFamiliares_pkey] PRIMARY KEY CLUSTERED ([id_cargo])
);

-- CreateTable
CREATE TABLE [dbo].[Cursos] (
    [id_cur] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [nom_cur] VARCHAR(50) NOT NULL,
    [institucion] VARCHAR(50) NOT NULL,
    CONSTRAINT [Cursos_pkey] PRIMARY KEY CLUSTERED ([id_cur])
);

-- CreateTable
CREATE TABLE [dbo].[Empleado] (
    [ci_em] VARCHAR(10) NOT NULL,
    [nom_em] VARCHAR(30) NOT NULL,
    [apel_em] VARCHAR(30) NOT NULL,
    [fecha_nace_em] VARCHAR(11) NOT NULL,
    [dir_domicilio_em] VARCHAR(100) NOT NULL,
    [correo_em] VARCHAR(50) NOT NULL,
    [celular_em] VARCHAR(10) NOT NULL,
    [telefono_em] VARCHAR(10),
    [est_civil_em] VARCHAR(10) NOT NULL,
    [genero_em] VARCHAR(10) NOT NULL,
    [cuenta_em] VARCHAR(5) NOT NULL,
    [fecha_ing_em] VARCHAR(11) NOT NULL,
    CONSTRAINT [Empleado_pkey] PRIMARY KEY CLUSTERED ([ci_em])
);

-- CreateTable
CREATE TABLE [dbo].[ExperienciaLaboral] (
    [id_exp] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [empresa] VARCHAR(50) NOT NULL,
    [cargo] VARCHAR(50) NOT NULL,
    [fecha_inicio] VARCHAR(11) NOT NULL,
    [fecha_fin] VARCHAR(11) NOT NULL,
    CONSTRAINT [ExperienciaLaboral_pkey] PRIMARY KEY CLUSTERED ([id_exp])
);

-- CreateTable
CREATE TABLE [dbo].[FormacionAcademica] (
    [id_for] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [titulo] VARCHAR(50) NOT NULL,
    [institucion] VARCHAR(80) NOT NULL,
    CONSTRAINT [FormacionAcademica_pkey] PRIMARY KEY CLUSTERED ([id_for])
);

-- CreateTable
CREATE TABLE [dbo].[LlamadosAtencion] (
    [id_atem] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [fecha_aten] VARCHAR(11) NOT NULL,
    [des_aten] VARCHAR(150) NOT NULL,
    [tipo_aten] VARCHAR(20) NOT NULL,
    CONSTRAINT [LlamadosAtencion_pkey] PRIMARY KEY CLUSTERED ([id_atem])
);

-- CreateTable
CREATE TABLE [dbo].[Permiso] (
    [id_permiso] INT NOT NULL IDENTITY(1,1),
    [nom_permiso] VARCHAR(30) NOT NULL,
    [descripcion] VARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Permiso_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Permiso_pkey] PRIMARY KEY CLUSTERED ([id_permiso])
);

-- CreateTable
CREATE TABLE [dbo].[PermisoUsuario] (
    [id_permiso_usuario] INT NOT NULL IDENTITY(1,1),
    [id_permiso] INT NOT NULL,
    [id_user] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [PermisoUsuario_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [PermisoUsuario_pkey] PRIMARY KEY CLUSTERED ([id_permiso_usuario])
);

-- CreateTable
CREATE TABLE [dbo].[Roles] (
    [nom_roles] VARCHAR(50) NOT NULL,
    [descripcion] VARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Roles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Roles_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Roles_pkey] PRIMARY KEY CLUSTERED ([nom_roles])
);

-- CreateTable
CREATE TABLE [dbo].[RolesPago] (
    [id_rol] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [fecha_pago] VARCHAR(11) NOT NULL,
    [total_ingresos] FLOAT(53) NOT NULL CONSTRAINT [RolesPago_total_ingresos_df] DEFAULT 0,
    [total_egresos] FLOAT(53) NOT NULL CONSTRAINT [RolesPago_total_egresos_df] DEFAULT 0,
    [mes_tercero] BIT NOT NULL CONSTRAINT [RolesPago_mes_tercero_df] DEFAULT 0,
    [mes_cuarto] BIT NOT NULL CONSTRAINT [RolesPago_mes_cuarto_df] DEFAULT 0,
    [mes_fondo] BIT NOT NULL CONSTRAINT [RolesPago_mes_fondo_df] DEFAULT 0,
    [quincena] BIT NOT NULL CONSTRAINT [RolesPago_quincena_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RolesPago_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [RolesPago_pkey] PRIMARY KEY CLUSTERED ([id_rol])
);

-- CreateTable
CREATE TABLE [dbo].[RolesPermiso] (
    [id_roles_permiso] INT NOT NULL IDENTITY(1,1),
    [nom_roles] VARCHAR(50) NOT NULL,
    [id_permiso] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RolesPermiso_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RolesPermiso_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RolesPermiso_pkey] PRIMARY KEY CLUSTERED ([id_roles_permiso])
);

-- CreateTable
CREATE TABLE [dbo].[RolesUser] (
    [id_roles_user] INT NOT NULL IDENTITY(1,1),
    [nom_roles] VARCHAR(50) NOT NULL,
    [id_user] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RolesUser_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [endAt] DATETIME2,
    CONSTRAINT [RolesUser_pkey] PRIMARY KEY CLUSTERED ([id_roles_user]),
    CONSTRAINT [RolesUser_id_user_nom_roles_endAt_key] UNIQUE NONCLUSTERED ([id_user],[nom_roles],[endAt])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [id_user] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10),
    [username] VARCHAR(30) NOT NULL,
    [password] VARCHAR(75) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Usuario_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Usuario_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [img] VARCHAR(300),
    [img_id] VARCHAR(50),
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([id_user])
);

-- CreateTable
CREATE TABLE [dbo].[Vacaciones] (
    [id_vac] INT NOT NULL IDENTITY(1,1),
    [ci_em] VARCHAR(10) NOT NULL,
    [ini_vac] VARCHAR(11) NOT NULL,
    [fin_vac] VARCHAR(11) NOT NULL,
    [ini_vac_period] VARCHAR(11),
    [fin_vac_period] VARCHAR(11),
    [dias] INT NOT NULL,
    CONSTRAINT [Vacaciones_pkey] PRIMARY KEY CLUSTERED ([id_vac])
);

-- CreateTable
CREATE TABLE [dbo].[Parametros] (
    [id_param] INT NOT NULL IDENTITY(1,1),
    [nom_param] VARCHAR(50) NOT NULL,
    CONSTRAINT [Parametros_pkey] PRIMARY KEY CLUSTERED ([id_param])
);

-- CreateTable
CREATE TABLE [dbo].[ParametrosDetalle] (
    [id_param_det] INT NOT NULL IDENTITY(1,1),
    [id_param] INT NOT NULL,
    [nom_param_det] VARCHAR(50) NOT NULL,
    [icon] VARCHAR(50) NOT NULL,
    [valor] FLOAT(53) NOT NULL CONSTRAINT [ParametrosDetalle_valor_df] DEFAULT 0,
    CONSTRAINT [ParametrosDetalle_pkey] PRIMARY KEY CLUSTERED ([id_param_det])
);

-- CreateTable
CREATE TABLE [dbo].[Modulos] (
    [label] VARCHAR(50) NOT NULL,
    [icon] VARCHAR(50) NOT NULL,
    [url] VARCHAR(50) NOT NULL,
    CONSTRAINT [Modulos_pkey] PRIMARY KEY CLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[SecionModul] (
    [labelModul] VARCHAR(50) NOT NULL,
    [label] VARCHAR(50) NOT NULL,
    CONSTRAINT [SecionModul_pkey] PRIMARY KEY CLUSTERED ([label])
);

-- CreateTable
CREATE TABLE [dbo].[OpcionesSection] (
    [id_opc] VARCHAR(6) NOT NULL,
    [labelSecion] VARCHAR(50) NOT NULL,
    [label] VARCHAR(50) NOT NULL,
    [icon] VARCHAR(50) NOT NULL,
    [url] VARCHAR(50) NOT NULL,
    [component] VARCHAR(50) NOT NULL,
    CONSTRAINT [OpcionesSection_pkey] PRIMARY KEY CLUSTERED ([id_opc])
);

-- CreateTable
CREATE TABLE [dbo].[OpcionesRoles] (
    [id_op_rol] INT NOT NULL IDENTITY(1,1),
    [id_opc] VARCHAR(6) NOT NULL,
    [nom_roles] VARCHAR(50) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [OpcionesRoles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [OpcionesRoles_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [OpcionesRoles_pkey] PRIMARY KEY CLUSTERED ([id_op_rol])
);

-- CreateTable
CREATE TABLE [dbo].[DetalleIngreso] (
    [id_det_ingr] INT NOT NULL IDENTITY(1,1),
    [monto] VARBINARY(max) NOT NULL,
    [id_rol] INT NOT NULL,
    [id_ingr] INT NOT NULL,
    CONSTRAINT [DetalleIngreso_pkey] PRIMARY KEY CLUSTERED ([id_det_ingr]),
    CONSTRAINT [DetalleIngreso_id_rol_id_ingr_key] UNIQUE NONCLUSTERED ([id_rol],[id_ingr])
);

-- CreateTable
CREATE TABLE [dbo].[Ingreso] (
    [id_ingr] INT NOT NULL IDENTITY(1,1),
    [nom_tipo_ingr] VARCHAR(50) NOT NULL,
    [es_defecto] BIT NOT NULL CONSTRAINT [Ingreso_es_defecto_df] DEFAULT 0,
    [ing_grabado] BIT NOT NULL CONSTRAINT [Ingreso_ing_grabado_df] DEFAULT 1,
    CONSTRAINT [Ingreso_pkey] PRIMARY KEY CLUSTERED ([id_ingr])
);

-- CreateTable
CREATE TABLE [dbo].[DetalleEgreso] (
    [id_det_egrs] INT NOT NULL IDENTITY(1,1),
    [monto] VARBINARY(max) NOT NULL,
    [id_rol] INT NOT NULL,
    [id_egrs] INT NOT NULL,
    CONSTRAINT [DetalleEgreso_pkey] PRIMARY KEY CLUSTERED ([id_det_egrs]),
    CONSTRAINT [DetalleEgreso_id_rol_id_egrs_key] UNIQUE NONCLUSTERED ([id_rol],[id_egrs])
);

-- CreateTable
CREATE TABLE [dbo].[Egreso] (
    [id_egrs] INT NOT NULL IDENTITY(1,1),
    [nom_tipo_egrs] VARCHAR(50) NOT NULL,
    [es_defecto] BIT NOT NULL CONSTRAINT [Egreso_es_defecto_df] DEFAULT 0,
    CONSTRAINT [Egreso_pkey] PRIMARY KEY CLUSTERED ([id_egrs])
);

-- AddForeignKey
ALTER TABLE [dbo].[CargoEmpleado] ADD CONSTRAINT [CargoEmpleado_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CargoEmpleado] ADD CONSTRAINT [CargoEmpleado_id_cargo_fkey] FOREIGN KEY ([id_cargo]) REFERENCES [dbo].[Cargos]([id_cargo]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cargos] ADD CONSTRAINT [Cargos_id_area_fkey] FOREIGN KEY ([id_area]) REFERENCES [dbo].[Area]([id_area]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CargosFamiliares] ADD CONSTRAINT [CargosFamiliares_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Cursos] ADD CONSTRAINT [Cursos_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ExperienciaLaboral] ADD CONSTRAINT [ExperienciaLaboral_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[FormacionAcademica] ADD CONSTRAINT [FormacionAcademica_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LlamadosAtencion] ADD CONSTRAINT [LlamadosAtencion_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PermisoUsuario] ADD CONSTRAINT [PermisoUsuario_id_permiso_fkey] FOREIGN KEY ([id_permiso]) REFERENCES [dbo].[Permiso]([id_permiso]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[PermisoUsuario] ADD CONSTRAINT [PermisoUsuario_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[Usuario]([id_user]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolesPago] ADD CONSTRAINT [RolesPago_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolesPermiso] ADD CONSTRAINT [RolesPermiso_id_permiso_fkey] FOREIGN KEY ([id_permiso]) REFERENCES [dbo].[Permiso]([id_permiso]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolesPermiso] ADD CONSTRAINT [RolesPermiso_nom_roles_fkey] FOREIGN KEY ([nom_roles]) REFERENCES [dbo].[Roles]([nom_roles]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolesUser] ADD CONSTRAINT [RolesUser_nom_roles_fkey] FOREIGN KEY ([nom_roles]) REFERENCES [dbo].[Roles]([nom_roles]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RolesUser] ADD CONSTRAINT [RolesUser_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[Usuario]([id_user]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Vacaciones] ADD CONSTRAINT [Vacaciones_ci_em_fkey] FOREIGN KEY ([ci_em]) REFERENCES [dbo].[Empleado]([ci_em]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ParametrosDetalle] ADD CONSTRAINT [ParametrosDetalle_id_param_fkey] FOREIGN KEY ([id_param]) REFERENCES [dbo].[Parametros]([id_param]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SecionModul] ADD CONSTRAINT [SecionModul_labelModul_fkey] FOREIGN KEY ([labelModul]) REFERENCES [dbo].[Modulos]([label]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OpcionesSection] ADD CONSTRAINT [OpcionesSection_labelSecion_fkey] FOREIGN KEY ([labelSecion]) REFERENCES [dbo].[SecionModul]([label]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OpcionesRoles] ADD CONSTRAINT [OpcionesRoles_id_opc_fkey] FOREIGN KEY ([id_opc]) REFERENCES [dbo].[OpcionesSection]([id_opc]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OpcionesRoles] ADD CONSTRAINT [OpcionesRoles_nom_roles_fkey] FOREIGN KEY ([nom_roles]) REFERENCES [dbo].[Roles]([nom_roles]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleIngreso] ADD CONSTRAINT [DetalleIngreso_id_rol_fkey] FOREIGN KEY ([id_rol]) REFERENCES [dbo].[RolesPago]([id_rol]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleIngreso] ADD CONSTRAINT [DetalleIngreso_id_ingr_fkey] FOREIGN KEY ([id_ingr]) REFERENCES [dbo].[Ingreso]([id_ingr]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleEgreso] ADD CONSTRAINT [DetalleEgreso_id_rol_fkey] FOREIGN KEY ([id_rol]) REFERENCES [dbo].[RolesPago]([id_rol]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleEgreso] ADD CONSTRAINT [DetalleEgreso_id_egrs_fkey] FOREIGN KEY ([id_egrs]) REFERENCES [dbo].[Egreso]([id_egrs]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
